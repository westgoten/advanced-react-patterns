// Compound Components
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {Switch} from '../switch'

const ToggleContext = React.createContext()
ToggleContext.displayName = 'ToggleContext'

const useToggle = () => {
  const value = React.useContext(ToggleContext)

  if (value === undefined) {
    throw new Error("useToggle must be used only by Toggle's children")
  }

  return value
}

function Toggle({children}) {
  const [on, setOn] = React.useState(false)
  const toggleCallback = React.useCallback(toggle, [])

  return (
    <ToggleContext.Provider value={[on, toggleCallback]}>
      {children}
    </ToggleContext.Provider>
  )

  function toggle() {
    setOn(previousState => !previousState)
  }
}

// 🐨 Flesh out each of these components

// Accepts `on` and `children` props and returns `children` if `on` is true
const ToggleOn = ({children}) => {
  const [on] = useToggle()
  return on ? children : null
}

// Accepts `on` and `children` props and returns `children` if `on` is false
const ToggleOff = ({children}) => {
  const [on] = useToggle()
  return !on ? children : null
}

// Accepts `on` and `toggle` props and returns the <Switch /> with those props.
const ToggleButton = () => {
  const [on, toggle] = useToggle()
  return <Switch on={on} onClick={toggle} />
}

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <ToggleButton />
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
