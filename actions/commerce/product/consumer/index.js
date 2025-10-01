/*
* <license header>
*/

const { RuntimeActionResponse, Parameters, EventConsumerAction, HttpStatus, Openwhisk, InfiniteLoopBreaker } = require("@adobe-commerce/aio-toolkit");

exports.main = EventConsumerAction.execute(
    'commerce-product-consumer',
    [
        "type",
        "data.value.created_at",
        "data.value.updated_at",
        "data.value.sku",
        "data.value.description"
    ],
    [],
    async (params, ctx) => {
        ctx.logger.info('Start processing request')
        ctx.logger.debug(`Consumer main params: ${Parameters.stringify(params)}`)

        try {
            const openwhiskClient = new Openwhisk(params.API_HOST, params.API_AUTH)

            let response = {}
            let statusCode = HttpStatus.OK

            ctx.logger.info(`Params type: ${params.type}`)

            // Detect infinite loop and break it
            const infiniteLoopEventTypes = [
                "com.adobe.commerce.observer.catalog_product_save_commit_after",
                "com.adobe.commerce.observer.catalog_product_delete_commit_after"
            ]

            const infiniteLoopKey = InfiniteLoopBreaker.fnInfiniteLoopKey(`ilk_${params.data.value.sku}`)
            const fnFingerprint = InfiniteLoopBreaker.fnFingerprint({
                product: params.data.value.sku,
                description: params.data.value.description,
            })

            const infiniteLoopData = {
                fingerprintFn: fnFingerprint,
                keyFn: infiniteLoopKey,
                event: params.type,
                eventTypes: infiniteLoopEventTypes
            }

            if (await InfiniteLoopBreaker.isInfiniteLoop(infiniteLoopData)) {
                ctx.logger.info(`Infinite loop break for event ${params.type}`)
                return RuntimeActionResponse.success(
                    {
                        type: params.type,
                        response: `event discarded to prevent infinite loop(${params.type})`
                    }
                )
            }

            switch (params.type) {
                case 'com.adobe.commerce.observer.catalog_product_save_commit_after': {
                    ctx.logger.info('Invoking product saved')
                    const createRes = await openwhiskClient.execute('commerce-product/saved', params.data)
                    response = createRes?.response?.result?.body
                    statusCode = createRes?.response?.result?.statusCode
                    break
                }
                case 'com.adobe.commerce.observer.catalog_product_delete_commit_after': {
                    ctx.logger.info('Invoking product deleted')
                    const deleteRes = await openwhiskClient.execute('commerce-product/deleted', params.data)
                    response = deleteRes?.response?.result?.body
                    statusCode = deleteRes?.response?.result?.statusCode
                    break
                }
                default: {
                    ctx.logger.error(`Event type not found: ${params.type}`)
                    return RuntimeActionResponse.error(HttpStatus.BAD_REQUEST, `This case type is not supported: ${params.type}`)
                }
            }

            if (!response.success) {
                ctx.logger.error(`Error response: ${response.error}`)
                return RuntimeActionResponse.error(statusCode, response.error)
            }

            // Prepare to detect infinite loop on subsequent events
            await InfiniteLoopBreaker.storeFingerPrint(infiniteLoopKey, fnFingerprint)

            ctx.logger.info(`Successful request: ${statusCode}`)
            return RuntimeActionResponse.success(
                {
                    type: params.type,
                    response: response
                }
            )
        } catch (error) {
            ctx.logger.error(`Server error: ${error.message}`)
            return RuntimeActionResponse.error(HttpStatus.INTERNAL_ERROR, error.message)
        }
    }
);
