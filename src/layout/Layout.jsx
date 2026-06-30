import React from 'react'
import Navbar from '../shared/Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import { ReactLenis, useLenis } from '@studio-freight/react-lenis'

const Layout = () => {
  return (
    <>

      <ReactLenis root>

          <div className='flex w-full'>
              <Navbar/>
                  <div className='flex flex-col w-full lg:w-[85%] overflow-x-hidden'>
                    <Outlet />
                  </div>
          </div>

      </ReactLenis>
    
    </>
  )
}

export default Layout