/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import {
    Badge
} from "@adobe/react-spectrum"
import actionWebInvoke from '../../../utils'
import actions from '../../../config.json'

class Entity
{
    /**
     * @var object
     */
    #actionCallHeaders

    /**
     * @param actionCallHeaders
     */
    constructor (actionCallHeaders) {
        this.#actionCallHeaders = actionCallHeaders
    }

    /**
     * @param itemIds
     * @returns {Promise<*|*[]>}
     */
    async delete(itemIds = []) {
        const response = await actionWebInvoke(
            actions["entity/delete"],
            this.#actionCallHeaders,
            {
                ids: itemIds
            }
        )

        if (response.error === undefined) {
            return this.prepare(response)
        }

        return []
    }

    /**
     * @returns {Promise<*|*[]>}
     */
    async list() {
        const response = await actionWebInvoke(
            actions["entity/list"],
            this.#actionCallHeaders
        )

        if (response.error === undefined) {
            return this.prepare(response)
        }

        return []
    }

    /**
     * @param id
     * @returns {Promise<string|Object|{}>}
     */
    async load(id){
        const response = await actionWebInvoke(
            actions["entity/load"],
            this.#actionCallHeaders,
            {
                id
            }
        )

        if (response.error === undefined) {
            return response
        }

        return {}
    }

    /**
     * @param formValues
     * @returns {Promise<string|Object|*[]>}
     */
    async save(formValues) {
        const response = await actionWebInvoke(
            actions["entity/save"],
            this.#actionCallHeaders,
            formValues
        )

        if (response.error === undefined) {
            return response
        }

        return []
    }

    /**
     * @param response
     * @returns {*}
     */
    prepare(response) {
        response.map((record) => {
            if (record.hasOwnProperty('status')) {
                record['statusBadge'] = record['status'].toString() === '1'? <Badge variant="positive">Enabled</Badge>: <Badge variant="negative">Disabled</Badge>
            }
            return record
        })
        return response
    }

    /**
     * @returns {[{name: string, uid: string},{name: string, uid: string},{name: string, uid: string},{name: string, uid: string},{name: string, uid: string}]}
     */
    columns() {
        return [
            { name: 'Name', uid: 'name' },
            { name: 'Status', uid: 'statusBadge' },
            { name: 'Created At', uid: 'createdAt' },
            { name: 'Updated At', uid: 'updatedAt' },
            { name: 'Actions', uid: 'actions' }
        ]
    }

    /**
     * @param editItem
     * @returns {{groups: [{code: string, label: string, fields: [{label: string, code: string, db_field: string, type: string, required: boolean},{label: string, code: string, db_field: string, type: string, required: boolean, options: [{value: string, label: string},{value: string, label: string}]}]}]}}
     */
    fields(editItem) {
        return {
            groups: [
                {
                    code: "entity_settings",
                    label: "Entity Settings",
                    fields: [
                        {
                            label: "Name",
                            code: "name",
                            db_field: "name",
                            type: "text",
                            required: true
                        }, {
                            label: "Status",
                            code: "status",
                            db_field: "status",
                            type: "select",
                            required: true,
                            options: [
                                {
                                    value: "1",
                                    label: "Enabled",
                                }, {
                                    value: "0",
                                    label: "Disabled"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}

module.exports = Entity
