// Prop Collections and Getters
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {Switch} from '../switch'

function useToggle() {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  // 🐨 Add a property called `togglerProps`. It should be an object that has
  // `aria-pressed` and `onClick` properties.
  return {on, getTogglerProps}

  function getTogglerProps({onClick, ...customProps}) {
    return {
      'aria-pressed': on,
      onClick: event => {
        toggle()
        if (onClick) {
          onClick(event)
        }
      },
      ...customProps,
    }
  }
}

function App() {
  const {on, getTogglerProps} = useToggle()
  return (
    <div>
      <Switch on={on} {...getTogglerProps({on})} />
      <hr />
      <button
        aria-label="custom-button"
        {...getTogglerProps({
          'aria-label': 'custom-button',
          onClick: () => console.info('onButtonClick'),
          id: 'custom-button-id',
        })}
      >
        {on ? 'on' : 'off'}
      </button>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
