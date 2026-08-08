import React from 'react'
import {assets} from '../assets/assets.js'

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

            <div>
                <img src={assets.logo} className='mb-5 w-32' alt="" />
                <p className='w-full md:w-2/3 text-gray-600'>
                    We are a beauty and personal care brand that believes in the power of self-care and self-expression. Our products are designed to help you look and feel your best, no matter what your style or personality.
                </p>
            </div>

             <div>
                <p className='text-x1 font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About</li>
                    <li>Delivery</li>
                    <li>Privacy</li>
                </ul>
             </div>

             <div>
                <p className='text-x1 font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>+91-9631371058</li>
                    <li>amankumarraj90@gmail.com</li>
                </ul>
             </div>

             <div>
                <hr />
                <p className='py-text text-sm text-center'>Copyright 2026@aman.com.All Rights Reserved</p>
             </div>


        </div>
      
    </div>
  )
}

export default Footer
