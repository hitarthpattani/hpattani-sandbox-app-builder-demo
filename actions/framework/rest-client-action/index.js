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

const {RuntimeAction, HttpMethod, RuntimeActionResponse, RestClient, HttpStatus} = require("@adobe-commerce/aio-toolkit");

exports.main = RuntimeAction.execute(
    'rest-client-action',
    [HttpMethod.GET, HttpMethod.POST],
    ['url', 'method'],
    ['authorization'],
    async (params, ctx) => {
        const { headers, logger } = ctx;

        try {
            // Extract parameters
            const { url, method = 'GET', body = null, requestHeaders = {} } = params;

            logger.info(`Testing REST endpoint: ${method} ${url}`);

            // Create RestClient instance
            const restClient = new RestClient();

            // Prepare headers (merge request headers with auth headers if available)
            const finalHeaders = {
                'Content-Type': 'application/json',
                'User-Agent': 'Adobe-App-Builder-REST-Tester/1.0',
                ...requestHeaders,
                // Add authorization header if provided
                ...(headers.authorization && { 'Authorization': headers.authorization })
            };

            let response;

            // Execute the appropriate HTTP method
            switch (method.toUpperCase()) {
                case 'GET':
                    logger.debug('Executing GET request');
                    response = await restClient.get(url, finalHeaders);
                    break;
                case 'POST':
                    logger.debug('Executing POST request', { bodySize: body ? JSON.stringify(body).length : 0 });
                    response = await restClient.post(url, body, finalHeaders);
                    break;
                case 'PUT':
                    logger.debug('Executing PUT request', { bodySize: body ? JSON.stringify(body).length : 0 });
                    response = await restClient.put(url, body, finalHeaders);
                    break;
                case 'DELETE':
                    logger.debug('Executing DELETE request');
                    response = await restClient.delete(url, finalHeaders);
                    break;
                default:
                    throw new Error(`Unsupported HTTP method: ${method}`);
            }

            // Return success response with detailed information
            return RuntimeActionResponse.success(response);
        } catch (error) {
            // Log error details
            logger.error('REST call failed', {
                message: error.message,
                stack: error.stack,
                statusCode: error.statusCode || null
            });

            // HTTP error response from server
            return RuntimeActionResponse.error(
                HttpStatus.INTERNAL_ERROR,
                `HTTP Error: ${error.message}`
            );
        }
    }
);

