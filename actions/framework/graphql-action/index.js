/*
* <license header>
*/

/**
 * This is a sample action showcasing how to access an external API
 *
 * Note:
 * You might want to disable authentication and authorization checks against Adobe Identity Management System for a generic action. In that case:
 *   - Remove the require-adobe-auth annotation for this action in the manifest.yml of your application
 *   - Remove the Authorization header from the array passed in checkMissingRequestInputs
 *   - The two steps above imply that every client knowing the URL to this deployed action will be able to invoke it without any authentication and authorization checks against Adobe Identity Management System
 *   - Make sure to validate these changes against your security requirements before deploying the action
 */

const {GraphQlAction} = require("@adobe-commerce/aio-toolkit");
const SampleTestResolver = require("./SampleTestResolver")

exports.main = GraphQlAction.execute(
    `type Query {
        sampleTest: String!
    }`,
    async (ctx) => {
        const sampleTestResolver = new SampleTestResolver(ctx)

        return {
            sampleTest: await sampleTestResolver.execute(),
        };
    }
);

