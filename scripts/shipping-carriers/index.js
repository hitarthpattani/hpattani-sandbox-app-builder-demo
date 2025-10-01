/*
* <license header>
*/

require('dotenv').config();

const { AdobeCommerceClient, ImsConnection } = require("@adobe-commerce/aio-toolkit");
const fs = require('fs');
const yaml = require('js-yaml');

const ShippingCarriers = require("./class");

async function index () {
    try {
        const adobeCommerceClient = new AdobeCommerceClient(
            process?.env?.COMMERCE_ACCS_BASE_URL || '',
            new ImsConnection(
                process?.env?.COMMERCE_IMS_CLIENT_ID || '',
                process?.env?.COMMERCE_IMS_CLIENT_SECRET || '',
                process?.env?.COMMERCE_IMS_TECHNICAL_ACCOUNT_ID || '',
                process?.env?.COMMERCE_IMS_TECHNICAL_ACCOUNT_EMAIL || '',
                process?.env?.COMMERCE_IMS_ORG_ID || '',
                process?.env?.COMMERCE_IMS_SCOPES?.split(", ") || []
            )
        );

        const shippingCarriers = new ShippingCarriers(adobeCommerceClient);
        console.log(await shippingCarriers.get());

        // const fileContents = fs.readFileSync('./scripts/shipping-carriers/config.yaml', 'utf8');
        // const config = yaml.load(fileContents);
        //
        // for (const shippingCarrier of config.shipping_carriers) {
        //     const createResponse = await shippingCarriers.create(shippingCarrier);
        //     console.log('Successfully created shipping carrier:', createResponse);
        // }
    } catch (error) {
        console.error('Error in main function:', error.message);
        throw error;
    }
}

exports.main = index
