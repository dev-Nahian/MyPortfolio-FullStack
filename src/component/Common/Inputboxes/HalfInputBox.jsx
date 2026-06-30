import React from 'react'

const HalfInputBox = ({type, placeholder, name, value, onChange, required, ...rest}) => {
  return (
    <input 
      type={type} 
      placeholder={placeholder} 
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className='w-full px-4 py-4 bg-transparent text-primaryWhite border border-primaryWhite600 rounded-lg outline-none focus:border-primaryPest transition-colors duration-300' 
      {...rest}
    />
  )
}

export default HalfInputBox