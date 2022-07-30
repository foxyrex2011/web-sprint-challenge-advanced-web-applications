import React, { useState } from 'react'
import PT from 'prop-types'
import axios from 'axios';
import {useHistory} from 'react-router-dom'

const initialFormValues = {
  username: '',
  password: '',
}

export default function LoginForm(props) {
  const [values, setValues] = useState(initialFormValues)
  const {login, message} = props
  // ✨ where are my props? Destructure them here
  console.log('password', values.password)
  console.log('username', values.username)
  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = evt => {
    evt.preventDefault()
    login(values.username, values.password)
  }

  const isDisabled = () => {
   if(values.username.trim().length < 3 || values.password.trim().length < 8){
    return true
   }
   else{return false}
    // ✨ implement
    // Trimmed username must be >= 3, and
    // trimmed password must be >= 8 for
    // the button to become enabled
  }

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button disabled={isDisabled()} id="submitCredentials">Submit credentials</button>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired,
}