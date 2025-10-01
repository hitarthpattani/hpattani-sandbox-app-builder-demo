/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import React, {useState} from 'react'
import { DataForm, useRouteParams } from "@adobe-commerce/aio-experience-kit"
import { ToastQueue } from "@react-spectrum/toast"
import EntityModel from "../../view-models/Entity"

export const EntityForm = ({ actionCallHeaders, id = undefined }) => {
    const entityModel = new EntityModel(actionCallHeaders)

    const [formFields, setFormFields] = useState({})
    const [editItem, setEditItem] = useState({})

    const { getNavigate } = useRouteParams();
    const navigate = getNavigate();

    return (
        <DataForm
            components={formFields}
            editItem={editItem}
            onFormLoad={async() => {
                // Load edit item first
                let editItem = {}
                if (id !== undefined) {
                    editItem = await entityModel.load(id)
                    setEditItem(editItem)
                }
                // Then load form fields
                const formFields = entityModel.fields(editItem)
                setFormFields(formFields)
            }}
            onFormSubmit={async (values) => {
                try {
                    await entityModel.save(values)
                    ToastQueue.positive("Entity saved successfully", {timeout: 5000})
                } catch (e) {
                    ToastQueue.negative(e.message, {timeout: 5000})
                }
            }}
            onPostFormSubmit={() => {
                navigate(`/entity/grid`)
            }}
            onBackPress={() => {
                navigate(`/entity/grid`)
            }}
        />
    )
}
