/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

const { HttpMethod, RuntimeAction, RuntimeActionResponse } = require("@adobe-commerce/aio-toolkit")
const EntityRepository = require("../../../lib/EntityRepository")

exports.main = RuntimeAction.execute(
    "entity-load",
    [HttpMethod.POST],
    ['id'],
    ['Authorization'],
    async (params) => {
        const entityRepository = new EntityRepository()
        return RuntimeActionResponse.success(await entityRepository.load(params.id))
    }
)
