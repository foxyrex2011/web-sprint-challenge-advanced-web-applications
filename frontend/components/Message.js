import React from 'react'
import styled, { keyframes } from 'styled-components'
import PT from 'prop-types'

const opacity = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const StyledMessage = styled.div`
  animation: ${opacity} 1s forwards;
`

export default function Message({ message }) {
  return (
    <StyledMessage key={message} id="message">
      {message}
    </StyledMessage>
  )
}

Message.propTypes = {
  message: PT.string.isRequired,
}