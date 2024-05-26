import React from 'react'

const ConfigBox = ({ icon, title, content }) => {
  return (
    <>
      <span>{icon}</span>
      <span className='config-title'>{title}</span>
      <span className='config-content'>{content}</span>
      <br/>
    </>
  )
}

export default ConfigBox
