/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

const { HttpMethod, RuntimeAction, RuntimeActionResponse } = require("@adobe-commerce/aio-toolkit")
const EntityRepository = require("../../../lib/EntityRepository")

exports.main = RuntimeAction.execute(
    "entity-delete",
    [HttpMethod.POST],
    ['ids'],
    ['Authorization'],
    async (params) => {
        const entityRepository = new EntityRepository()
        return RuntimeActionResponse.success(await entityRepository.delete(params.ids))
    }
)
