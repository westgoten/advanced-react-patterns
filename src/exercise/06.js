// Control Props
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {Switch} from '../switch'

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach(fn => fn?.(...args))

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset',
}

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case actionTypes.toggle: {
      return {on: !state.on}
    }
    case actionTypes.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

const isProd = process.env.NODE_ENV === 'production'

function useControlledComponentWarning(
  isControlled,
  hasOnChange,
  controlPropName,
  componentName,
) {
  const wasControlled = React.useRef(isControlled)

  React.useEffect(() => {
    if (isControlled && !hasOnChange && !isProd) {
      console.warn(
        `Warning: Failed prop type: You provided a '${controlPropName}' prop to ${componentName} without an 'onChange' handler. This will render a read-only ${componentName}. If the ${componentName} should be mutable use 'onChange'.`,
      )
    }
  }, [isControlled, hasOnChange, controlPropName, componentName])

  React.useEffect(() => {
    if (wasControlled.current !== isControlled && !isProd) {
      console.warn(
        `Warning: A component is changing an ${componentName} from controlled to uncontrolled or vice-versa, which should not happen. Decide between using a controlled or uncontrolled ${componentName} for the lifetime of the component.`,
      )
    }
  }, [isControlled, componentName])
}

function useToggle({
  initialOn = false,
  reducer = toggleReducer,
  on: controlledOn,
  onChange,
} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)
  // 🐨 determine whether on is controlled and assign that to `onIsControlled`
  const isOnControlled = controlledOn !== undefined && controlledOn !== null
  const on = isOnControlled ? controlledOn : state.on

  useControlledComponentWarning(
    isOnControlled,
    Boolean(onChange),
    'on',
    'useToggle',
  )

  // make these call `dispatchWithOnChange` instead
  const dispatchWithOnChange = action => {
    if (onChange) {
      const newState = reducer({on}, action)
      onChange(newState, action)
    }

    if (!isOnControlled) {
      dispatch(action)
    }
  }
  const toggle = () => dispatchWithOnChange({type: actionTypes.toggle})
  const reset = () =>
    dispatchWithOnChange({type: actionTypes.reset, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      on,
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function Toggle({on: controlledOn, onChange, initialOn, reducer}) {
  const {getTogglerProps} = useToggle({
    on: controlledOn,
    onChange,
    initialOn,
    reducer,
  })
  const props = getTogglerProps()
  return <Switch {...props} />
}

function App() {
  const [bothOn, setBothOn] = React.useState(false)
  const [timesClicked, setTimesClicked] = React.useState(0)

  function handleToggleChange(state, action) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return
    }
    setBothOn(state.on)
    setTimesClicked(c => c + 1)
  }

  function handleResetClick() {
    setBothOn(false)
    setTimesClicked(0)
  }

  return (
    <div>
      <div>
        <Toggle on={bothOn} onChange={handleToggleChange} />
        <Toggle on={bothOn} onChange={handleToggleChange} />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      <div>
        <div>Uncontrolled Toggle:</div>
        <Toggle
          onChange={(...args) =>
            console.info('Uncontrolled Toggle onChange', ...args)
          }
        />
      </div>
    </div>
  )
}

export default App
// we're adding the Toggle export for tests
export {Toggle}

/*
eslint
  no-unused-vars: "off",
*/
