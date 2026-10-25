import React, { useState } from 'react'
import { assets } from '../assets/assets.js'
import { Link } from 'react-router-dom'

const Footer = () => {
  const [modalContent, setModalContent] = useState(null);

  return (
    <div>
      <div className='flex flex-col sm:grid sm:grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-32 text-sm'>
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="GlowNest" />
          <p className='w-full md:w-4/5 text-gray-600 leading-relaxed'>
            We are a beauty and personal care brand that believes in the power of self-care and self-expression. Our products are designed to help you look and feel your best, no matter what your style or routine.
          </p>
        </div>

        <div>
          <p className='text-lg font-medium mb-5 text-gray-800'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li><Link to='/' className='hover:text-black transition-colors'>Home</Link></li>
            <li><Link to='/about' className='hover:text-black transition-colors'>About</Link></li>
            <li>
              <button 
                onClick={() => setModalContent({
                  title: 'Delivery Policy', 
                  body: 'Orders are processed within 24-48 hours. Standard delivery across India takes 3-5 business days. Express delivery options are available at checkout. Free shipping on qualifying orders.'
                })} 
                className='hover:text-black transition-colors text-left cursor-pointer'
              >
                Delivery
              </button>
            </li>
            <li>
              <button 
                onClick={() => setModalContent({
                  title: 'Privacy Policy', 
                  body: 'Your privacy is essential to us. We never sell your personal information to third parties. All payment processing is securely encrypted using industry-standard protocols.'
                })} 
                className='hover:text-black transition-colors text-left cursor-pointer'
              >
                Privacy
              </button>
            </li>
          </ul>
        </div>

        <div>
          <p className='text-lg font-medium mb-5 text-gray-800'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>
              <a href='tel:+919631371058' className='hover:text-black transition-colors'>+91-9631371058</a>
            </li>
            <li>
              <a href='mailto:amankumarraj90@gmail.com' className='hover:text-black transition-colors'>amankumarraj90@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <hr className='border-gray-200' />
        <p className='py-5 text-xs text-center text-gray-500'>Copyright 2026 @ GlowNest - All Rights Reserved</p>
      </div>

      {/* Policy Modal */}
      {modalContent && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg max-w-md w-full p-6 shadow-xl relative'>
            <h3 className='text-lg font-semibold text-gray-900 mb-3'>{modalContent.title}</h3>
            <p className='text-sm text-gray-600 leading-relaxed mb-6'>{modalContent.body}</p>
            <div className='text-right'>
              <button 
                onClick={() => setModalContent(null)} 
                className='bg-black text-white text-xs px-5 py-2 rounded cursor-pointer hover:bg-gray-800'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Footer
