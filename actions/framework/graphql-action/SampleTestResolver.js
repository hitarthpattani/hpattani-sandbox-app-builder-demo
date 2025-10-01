/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

class SampleTestResolver
{
    constructor(ctx) {
        this.ctx = ctx
    }

    execute() {
        return async ()  => {
            console.log(this.ctx.headers.store || "default")
            return "SAMPLE TEST"
        }
    }
}

module.exports = SampleTestResolver
