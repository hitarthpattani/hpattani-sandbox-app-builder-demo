/*
* <license header>
*/

const { AdobeCommerceClient } = require("@adobe-commerce/aio-toolkit");

class ShippingCarriers {
    #adobeCommerceClient;

    /**
     * @param adobeCommerceClient
     */
    constructor(
        adobeCommerceClient
    ) {
        this.#adobeCommerceClient = adobeCommerceClient;
    }

    /**
     * Gets the list of shipping carriers
     * @returns {Promise<object>} List of shipping carriers
     */
    async get() {
        try {
            return await this.#adobeCommerceClient.get('V1/oope_shipping_carrier');
        } catch (error) {
            console.error('Error in get method:', error.message);
            throw error;
        }
    }

    async create(shippingCarrier) {
        try {
            console.log('Creating shipping carrier:', shippingCarrier);
            const response = await this.#adobeCommerceClient.post('V1/oope_shipping_carrier', {}, shippingCarrier);
            console.log('Create response:', response);
            return response;
        } catch (error) {
            console.error('Error in create method:', error.message);
            console.error('Full error:', error);
            throw error;
        }
    }
}

module.exports = ShippingCarriers;
