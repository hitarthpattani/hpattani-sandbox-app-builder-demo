/**
 * Copyright © Adobe, Inc. All rights reserved.
 */

import React from "react"
import {Provider, defaultTheme, View, Text} from "@adobe/react-spectrum"
import { Route, Routes } from "react-router-dom"
import { HashRouter as Router } from 'react-router-dom'
import { ToastContainer } from "@react-spectrum/toast"
import {LayoutOptions, MainContainer, NavigationOptions} from "@adobe-commerce/aio-experience-kit"

import ActionsForm from "./ActionsForm"

import { EntityWrapper } from "./Entity/components/Wrapper"

import HomeIcon from "@spectrum-icons/workflow/Home"
import BookIcon from "@spectrum-icons/workflow/Book"

export default function ExtensionRegistration(props) {
    init(props).catch(console.error)
    // return oneColumnContainer(props)
    return twoColumnLeftContainer(props)
    // return actionForm(props)
}

const oneColumnContainer = (props) => {
    let buttons = [
        {
            label: "Home",
            path: "/",
            icon: <HomeIcon size={"L"} gridArea="Home" />
        }, {
            label: "Entities",
            path: "/entity/grid",
            icon: <BookIcon size={"XS"} gridArea="BookIcon" />
        }
    ]

    let routes = [
        {
            paths: ['/'],
            component: <Text>Home</Text>
        }, {
            paths: ['/entity/:component/', '/entity/:component/:id'],
            component: <EntityWrapper runtime={props.runtime} ims={props.ims} actionCallHeaders={props.actionCallHeaders} />
        }
    ]

    return (
        <View>
            <MainContainer
                title={"Field Mapping Application"}
                titleLevel={1}
                buttons={buttons}
                routes={routes}
                navigation={NavigationOptions.NavigationButtons}
                navigationMarginBottom={"size-200"}
                layout={LayoutOptions.OneColumn} />
            <ToastContainer />
        </View>
    )
}

const twoColumnLeftContainer = (props) => {
    let buttons = [
        {
            label: "Home",
            path: "/",
            icon: <HomeIcon size={"S"} marginEnd={"size-100"} gridArea="Home" />
        }, {
            label: "Entities",
            path: "/entity/grid",
            icon: <BookIcon size={"S"} marginEnd={"size-100"} gridArea="BookIcon" />
        }
    ]

    let routes = [
        {
            paths: ['/'],
            component: <Text>Home</Text>
        }, {
            paths: ['/entity/:component/', '/entity/:component/:id'],
            component: <EntityWrapper runtime={props.runtime} ims={props.ims} actionCallHeaders={props.actionCallHeaders} />
        }
    ]

    return (
        <View>
            <MainContainer
                title={"Field Mapping Application"}
                titleLevel={1}
                buttons={buttons}
                navigationMarginTop={"size-200"}
                routes={routes} />
            <ToastContainer />
        </View>
    )
}

const actionForm = (props) => {
    return (
        <Router>
            <Provider theme={defaultTheme} colorScheme={'light'}>
                <Routes>
                    <Route index element={<ActionsForm runtime={props.runtime} ims={props.ims} actionCallHeaders={props.actionCallHeaders} />} />
                </Routes>
            </Provider>
        </Router>
    )
}

const init = async (props) => {
}
