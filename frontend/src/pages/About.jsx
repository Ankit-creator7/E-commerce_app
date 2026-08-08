import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt=" " />
        <div className='flex flex-col justify-center gap-6 text-gray-600'>
          <p>
            GlowNest is a cosmetics and self-care store created for everyday beauty routines. We bring together skincare, makeup, hair care, and fragrance essentials that are simple to choose, easy to use, and made to fit different moods, styles, and routines.
          </p>
          <p>
            Our goal is to make beauty feel less confusing and more personal. Whether you are looking for a gentle cleanser, a soft everyday lipstick, a nourishing hair oil, or a fresh fragrance, GlowNest helps you find products that match your needs.
          </p>
          <b className='text-gray-800'>Our Mission</b>
          <p>We believe good beauty care should feel comfortable, reliable, and enjoyable, with products that support your routine without making it complicated.</p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 sm:py-20 flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p>All our products undergo rigorous testing to ensure they meet the highest standards of quality and safety.</p>
        </div>
        <div className='border px-10 md:px-16 sm:py-20 flex-col gap-5'>
          <b>Convenience:</b>
          <p>Our streamlined shopping experience makes it easy to find and purchase your favorite beauty products.</p>
        </div>
        <div className='border px-10 md:px-16 sm:py-20 flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Our dedicated team is here to assist you with any questions or concerns you may have about our products or services.</p>
        </div>

      </div>
      <NewsletterBox />

    </div>
  )
}

export default About
