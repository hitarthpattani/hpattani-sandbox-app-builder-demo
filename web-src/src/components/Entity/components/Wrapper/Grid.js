/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import React, { useState } from 'react'
import {
    View,
    ActionButton,
    Text
} from "@adobe/react-spectrum"
import { DataTable, useRouteParams, ConfirmationDialog } from "@adobe-commerce/aio-experience-kit"
import AddCircle from "@spectrum-icons/workflow/AddCircle"
import EntityModel from "../../view-models/Entity"

export const EntityGrid = ({actionCallHeaders}) => {
    const entityModel = new EntityModel(actionCallHeaders)

    const [isProcessing, setProcessing] = useState(false)

    const [gridData, setGridData] = useState([])
    const [deleteMessage, setDeleteMessage] = useState("")
    const [deleteKeys, setDeleteKeys] = useState([])

    const columns = entityModel.columns()

    const gridActions = [
        { key: 'edit', text: 'Edit' },
        { key: 'delete', text: 'Delete' }
    ]

    const massActions = [
        { key: 'delete', text: 'Delete' }
    ]

    const { getNavigate } = useRouteParams();
    const navigate = getNavigate();

    const buttons = [
        <ActionButton
            variant="primary"
            type="button"
            marginEnd={"size-150"}
            isDisabled={false}
            onPress={() => {
                navigate(`/entity/form`)
            }}>
            <AddCircle gridArea="Create Entity"/><Text>Create Entity</Text>
        </ActionButton>
    ]

    return (
        <View>
            <DataTable
                columns={columns}
                data={gridData}
                buttons={buttons}
                gridActions={gridActions}
                massActions={massActions}
                isProcessing={isProcessing}
                onMassActionPress={async (key, ids) => {
                    switch (key) {
                        case "delete":
                            setDeleteKeys(ids)
                            setDeleteMessage("Are you Sure you want to delete selected items?")
                            break
                    }
                }}
                onGridActionPress={async (key, item) => {
                    switch (key) {
                        case "edit":
                            navigate(`/entity/form/${item.id}`)
                            break
                        case "delete":
                            setDeleteKeys([item.id])
                            setDeleteMessage("Are you Sure you want to delete?")
                            break
                    }
                }}
                onGridLoad={async () => {
                    setGridData(await entityModel.list())
                }} />
            <ConfirmationDialog
                title={"Delete Dialog"}
                message={deleteMessage}
                primaryButtonVariant={"negative"}
                onDismiss={() => {
                    setDeleteMessage("")
                }}
                onSecondaryPress={() => {
                    setDeleteMessage("")
                }}
                onPrimaryPress={async () => {
                    setDeleteMessage("")

                    setProcessing(true)
                    setGridData(await entityModel.delete(deleteKeys))
                    setProcessing(false)
                }} />
        </View>
    )
}
