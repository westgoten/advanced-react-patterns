// Flexible Compound Components
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'
import {Switch} from '../switch'

// 🐨 create your ToggleContext context here
// 📜 https://reactjs.org/docs/context.html#reactcreatecontext
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

// 🐨 we'll still get the children from props (as it's passed to us by the
// developers using our component), but we'll get `on` implicitly from
// ToggleContext now
// 🦉 You can create a helper method to retrieve the context here. Thanks to that,
// your context won't be exposed to the user
function ToggleOn({children}) {
  const [on] = useToggle()
  return on ? children : null
}

// 🐨 do the same thing to this that you did to the ToggleOn component
function ToggleOff({children}) {
  const [on] = useToggle()
  return !on ? children : null
}

// 🐨 get `on` and `toggle` from the ToggleContext with `useContext`
function ToggleButton() {
  const [on, toggle] = useToggle()
  return <Switch on={on} onClick={toggle} />
}

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <div>
          <ToggleButton />
        </div>
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
