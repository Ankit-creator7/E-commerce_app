import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { toast } from 'react-toastify'

const Contact = () => {
  const handleExploreJobs = () => {
    toast.info("Thank you for your interest! Please forward your resume to careers@glownest.com.");
    window.location.href = "mailto:careers@glownest.com?subject=Job%20Application%20at%20GlowNest";
  };

  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px] rounded' src={assets.contact_img} alt="Contact GlowNest" />

        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-700'>Our Store</p>

          <p className='text-gray-500 leading-relaxed'>
            GlowNest Beauty Studio <br />
            Mumbai, Maharashtra, India
          </p>

          <p className='text-gray-500 leading-relaxed'>
            Tel: <a href="tel:+919876543210" className="hover:underline text-gray-700">+91 98765 43210</a> <br />
            Email: <a href="mailto:support@glownest.com" className="hover:underline text-gray-700">support@glownest.com</a>
          </p>

          <p className='font-semibold text-xl text-gray-700'>Careers at GlowNest</p>

          <p className='text-gray-500 leading-relaxed'>
            Learn more about our team, beauty collections, and current openings.
          </p>

          <button 
            onClick={handleExploreJobs}
            className='border border-black px-8 py-3.5 text-sm hover:bg-black hover:text-white transition-all duration-300 cursor-pointer'
          >
            Explore Jobs
          </button>
        </div>
      </div>

      <NewsletterBox />
    </div>
  )
}

export default Contact
