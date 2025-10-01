/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

const { FileRepository } = require("@adobe-commerce/aio-toolkit")

class EntityRepository extends FileRepository
{
    /**
     * @constructor
     */
    constructor() {
        super("/sandbox-connector/entity")
    }
}

module.exports = EntityRepository
