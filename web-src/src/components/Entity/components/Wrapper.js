/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import React from 'react'
import {
    Heading,
    View,
    Flex,
    Text
} from "@adobe/react-spectrum"
import { useRouteParams } from "@adobe-commerce/aio-experience-kit"

import { EntityForm } from "./Wrapper/Form"
import { EntityGrid } from "./Wrapper/Grid"

export const EntityWrapper = ({actionCallHeaders}) => {
    const { getParam } = useRouteParams();

    let title = getParam('component') === "grid" || getParam('component') === undefined? `Manage Entities`: `Create Entity`
    title = getParam('id') === undefined? title: `Modify Entity: ${getParam('id')}`

    return (
        <View elementType="main">
            <Flex direction="column" UNSAFE_className={"Entities-Page"}>
                <Heading level={2} UNSAFE_className={"title"} marginTop={"size-0"} marginBottom={"size-300"}>{title}</Heading>
                {
                    getParam('component') === "grid" || getParam('component') === undefined?
                        (<EntityGrid actionCallHeaders={actionCallHeaders} />):
                        (<EntityForm actionCallHeaders={actionCallHeaders} id={getParam('id')} />)
                }
            </Flex>
        </View>
    )
}
