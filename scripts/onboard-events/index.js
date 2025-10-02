/*
* <license header>
*/

require('dotenv').config();

const fs = require('fs');
const yaml = require('js-yaml');
const path = require("path");

const { AdobeAuth, BearerToken, OnboardEvents } = require("@adobe-commerce/aio-toolkit");

async function index () {
    try {
        const token = await AdobeAuth.getToken(
            process?.env?.OAUTH_CLIENT_ID || '',
            process?.env?.OAUTH_CLIENT_SECRET || '',
            process?.env?.OAUTH_TECHNICAL_ACCOUNT_ID || '',
            process?.env?.OAUTH_TECHNICAL_ACCOUNT_EMAIL || '',
            process?.env?.OAUTH_ORG_ID || '',
            process?.env?.OAUTH_SCOPES.split(", ") || []
        );

        if (token) {
            const tokenInfo = BearerToken.info(token);
            if (tokenInfo.isValid) {
                const onboardEvents = new OnboardEvents(
                    "HPattani Sandbox Connector",
                    process?.env?.IO_CONSUMER_ID || '',
                    process?.env?.IO_PROJECT_ID || '',
                    process?.env?.IO_WORKSPACE_ID || '',
                    process?.env?.OAUTH_CLIENT_ID || '',
                    tokenInfo.token
                );
                onboardEvents.getLogger().debug('[INFO] Token generated successfully');
                onboardEvents.getLogger().debug(`[INFO] Token expires at: ${tokenInfo.expiry ? tokenInfo.expiry : 'Unknown'}`);

                const ioEventsFileContents = fs.readFileSync(path.resolve(__dirname, "./io-events-config.yaml"), 'utf8');
                const ioEventsConfig = yaml.load(ioEventsFileContents, {});
                const ioEventsResponse = await onboardEvents.process(ioEventsConfig);

                console.log(ioEventsResponse.createdProviders[0].raw)
            } else {
                console.log('Token is not valid');
            }
        } else {
            console.log('Token generation failed - no token returned');
        }
    } catch (error) {
        console.error('Error in main function:', error.message);
    }
}

exports.main = index
