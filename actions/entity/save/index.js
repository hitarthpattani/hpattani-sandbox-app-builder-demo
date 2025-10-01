/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

const { HttpMethod, RuntimeAction, RuntimeActionResponse } = require("@adobe-commerce/aio-toolkit")
const EntityRepository = require("../../../lib/EntityRepository")

const requiredParams = [
    "name",
    "status"
]

exports.main = RuntimeAction.execute(
    "entity-save",
    [HttpMethod.POST],
    requiredParams,
    ['Authorization'],
    async (params) => {
        const entityRepository = new EntityRepository()

        let payload = {}
        for (const fieldName in requiredParams) {
            payload[requiredParams[fieldName]] = params[requiredParams[fieldName]]
        }
        if (Object.prototype.hasOwnProperty.call(params, 'id')) {
            payload['id'] = params['id']
        }

        return RuntimeActionResponse.success((await entityRepository.save(payload)).toString())
    }
)
