/*
* <license header>
*/

require('dotenv').config();

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

        if (!token) {
            throw new Error('Token generation failed - no token returned');
        }

        const tokenInfo = BearerToken.info(token);

        if(!tokenInfo.isValid) {
            throw new Error('Token is not valid');
        }

        const onboardEvents = new OnboardEvents(
            "HPattani AIO Toolkit V1",
            process?.env?.IO_CONSUMER_ID || '',
            process?.env?.IO_PROJECT_ID || '',
            process?.env?.IO_WORKSPACE_ID || '',
            process?.env?.OAUTH_CLIENT_ID || '',
            tokenInfo.token
        );

        onboardEvents.getLogger().debug('[INFO] Token generated successfully');
        onboardEvents.getLogger().debug(`[INFO] Token expires at: ${tokenInfo.expiry ? tokenInfo.expiry : 'Unknown'}`);

        const ioEventsConfig = require('./config/io-events-config.json');
        await onboardEvents.process(ioEventsConfig);
    } catch (error) {
        console.error('Error in main function:', error.message);
        throw error;
    }
}

exports.main = index
