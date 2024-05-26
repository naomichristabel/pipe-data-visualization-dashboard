import React from 'react'

const Info = ({ icon, title, content }) => {
  return (
    <div className='row modal-text align-items-center'>
      <div className='row justify-content-center mb-3'>{icon}</div>
      <div className='row justify-content-center'><p>{title}</p></div>
      <div className='row justify-content-center'>{content}</div>
    </div>
  )
}

export default Info
