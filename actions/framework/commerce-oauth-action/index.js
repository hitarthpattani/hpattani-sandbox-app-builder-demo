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

const {RuntimeAction, HttpMethod, RuntimeActionResponse, AdobeCommerceClient, Oauth1aConnection} = require("@adobe-commerce/aio-toolkit");

exports.main = RuntimeAction.execute(
    'commerce-oauth-action',
    [HttpMethod.GET, HttpMethod.POST],
    [],
    ['authorization'],
    async (params) => {
        const adobeCommerceClient = new AdobeCommerceClient(
            params.PAAS_BASE_URL,
            new Oauth1aConnection(
                params.OAUTH_CONSUMER_KEY,
                params.OAUTH_CONSUMER_SECRET,
                params.OAUTH_ACCESS_TOKEN,
                params.OAUTH_ACCESS_TOKEN_SECRET
            )
        );

        const list = await adobeCommerceClient.get(`V1/products/attributes?searchCriteria=&fields=items[attribute_code,default_frontend_label,options[value,label]]`);
        return RuntimeActionResponse.success(list);
    }
);

