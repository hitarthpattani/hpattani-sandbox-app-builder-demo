/*
* <license header>
*/

import React from 'react'
import { Provider, defaultTheme } from '@adobe/react-spectrum'
import ErrorBoundary from 'react-error-boundary'
import ExtensionRegistration from './ExtensionRegistration'

function App (props) {
  console.log('runtime object:', props.runtime)
  console.log('ims object:', props.ims)
  console.log('actionCallHeaders object:', props.actionCallHeaders)

  // use exc runtime event handlers
  // respond to configuration change events (e.g. user switches org)
  props.runtime.on('configuration', ({ imsOrg, imsToken, locale }) => {
    console.log('configuration change', { imsOrg, imsToken, locale })
  })
  // respond to history change events
  props.runtime.on('history', ({ type, path }) => {
    console.log('history change', { type, path })
  })

  return (
    <ErrorBoundary onError={onError} FallbackComponent={fallbackComponent}>
      <Provider theme={defaultTheme} colorScheme={'light'}>
        <ExtensionRegistration runtime={props.runtime} ims={props.ims} actionCallHeaders={props.actionCallHeaders} />
      </Provider>
    </ErrorBoundary>
  )

  // Methods

  // error handler on UI rendering failure
  function onError (e, componentStack) { }

  // component to show if UI fails rendering
  function fallbackComponent ({ componentStack, error }) {
    return (
      <React.Fragment>
        <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
          Something went wrong :(
        </h1>
        <pre>{componentStack + '\n' + error.message}</pre>
      </React.Fragment>
    )
  }
}

export default App
