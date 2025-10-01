/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

const { OpenwhiskAction, Parameters, RuntimeActionResponse, HttpStatus } = require("@adobe-commerce/aio-toolkit");

exports.main = OpenwhiskAction.execute(
    'commerce-product-saved',
    async (params, ctx) => {
        ctx.logger.info('Start processing request')
        ctx.logger.debug(`Received params: ${Parameters.stringify(params)}`)

        try {
            ctx.logger.debug('Process finished successfully')
            return RuntimeActionResponse.success(
                {
                    success: true,
                    message: 'Product saved successfully'
                }
            )
        } catch (error) {
            ctx.logger.error(`Error processing the request: ${error.message}`)
            return RuntimeActionResponse.error(HttpStatus.INTERNAL_ERROR, error.message)
        }
    }
)
