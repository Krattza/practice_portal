import React from 'react'

import Login from './Login'
import Register from './Register'

const Hero = ({setEmail}) => {
  return (
    <>
        {/* <div className="grid grid-cols-2 min-h-screen">
  <div className="flex items-center justify-center">
    <Login />
  </div>

  <div className="flex items-center justify-center">
    <Register setEmail={setEmail} />
  </div>
</div> */}
<div className='min-w-screen '>
    <img className='m-auto min-w-[1280px] p-4' src="https://c4.wallpaperflare.com/wallpaper/69/313/136/louis-coyle-fantasy-art-digital-art-ultra-wide-gradient-hd-wallpaper-preview.jpg" alt="nature-image" />
</div>
    </>
  )
}

export default Hero