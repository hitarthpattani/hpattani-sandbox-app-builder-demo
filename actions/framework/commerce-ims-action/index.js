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

const {RuntimeAction, HttpMethod, RuntimeActionResponse, AdobeCommerceClient, Oauth1aConnection, ImsConnection} = require("@adobe-commerce/aio-toolkit");

exports.main = RuntimeAction.execute(
    'commerce-ims-action',
    [HttpMethod.GET, HttpMethod.POST],
    [],
    ['authorization'],
    async (params) => {
        const adobeCommerceClient = new AdobeCommerceClient(
            params.SAAS_BASE_URL || '',
            new ImsConnection(
                params.OAUTH_CLIENT_ID || '',
                params.OAUTH_CLIENT_SECRET || '',
                params.OAUTH_TECHNICAL_ACCOUNT_ID || '',
                params.OAUTH_TECHNICAL_ACCOUNT_EMAIL || '',
                params.OAUTH_ORG_ID || '',
                params.OAUTH_SCOPES?.split(", ") || []
            )
        );

        const list = await adobeCommerceClient.get(`V1/products/attributes?searchCriteria=`);
        return RuntimeActionResponse.success(list);
    }
);

