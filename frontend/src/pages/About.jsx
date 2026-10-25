import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className='border-t pt-10 text-gray-800'>
      {/* Header Section */}
      <div className='text-center max-w-2xl mx-auto mb-14'>
        <span className='text-xs uppercase tracking-widest text-orange-600 font-semibold bg-orange-50 px-3 py-1 rounded-full'>
          The GlowNest Story
        </span>
        <div className='text-3xl sm:text-4xl mt-3 mb-4'>
          <Title text1={'ABOUT'} text2={'OUR BRAND'} />
        </div>
        <p className='text-sm sm:text-base text-gray-500 leading-relaxed'>
          Crafted with pure botanicals, skin-friendly actives, and mindful science to bring natural harmony to your everyday routine.
        </p>
      </div>

      {/* Main Editorial Story Section */}
      <div className='flex flex-col lg:flex-row items-center gap-12 lg:gap-16 my-8 mb-20'>
        {/* Left: Aesthetic Product Image with Badge */}
        <div className='w-full lg:w-1/2 relative group'>
          <div className='overflow-hidden rounded-2xl shadow-xl border border-gray-100 bg-amber-50/40'>
            <img 
              className='w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out' 
              src={assets.about_img} 
              alt="GlowNest Botanical Skincare Formulation" 
            />
          </div>
          {/* Floating Pill Badge */}
          <div className='absolute -bottom-5 right-6 sm:right-10 bg-white/95 backdrop-blur-md border border-gray-200 py-3 px-5 rounded-xl shadow-lg flex items-center gap-3'>
            <div className='w-3 h-3 rounded-full bg-green-500 animate-pulse'></div>
            <div>
              <p className='text-xs font-bold text-gray-800 tracking-wide'>100% CLEAN BEAUTY</p>
              <p className='text-[10px] text-gray-500'>Dermatologically Tested & Cruelty-Free</p>
            </div>
          </div>
        </div>

        {/* Right: Brand Philosophy & Mission */}
        <div className='w-full lg:w-1/2 flex flex-col justify-center gap-6 text-gray-600'>
          <h2 className='text-2xl sm:text-3xl font-medium text-gray-900 leading-snug'>
            Beauty made simple, transparent, and effortlessly radiant.
          </h2>

          <p className='text-sm sm:text-base leading-relaxed'>
            GlowNest was born from a simple belief: self-care should feel comforting, reliable, and deeply rejuvenating. In a world full of 12-step routines and confusing chemical names, we set out to create high-performance botanical essentials that celebrate your natural glow.
          </p>

          <p className='text-sm sm:text-base leading-relaxed'>
            From nutrient-dense plant oils and cold-pressed floral waters to skin-identical hydrators, every formulation is developed to support your skin’s delicate barrier without causing irritation or heaviness.
          </p>

          {/* Founder Quote Block */}
          <div className='border-l-2 border-black pl-5 py-2 my-2 bg-stone-50 rounded-r-lg'>
            <p className='text-sm italic text-gray-700 font-serif leading-relaxed'>
              "We formulate products we are proud to use on ourselves and share with the people we love—clean, kind, and remarkably effective."
            </p>
            <p className='text-xs font-semibold text-gray-900 mt-2 uppercase tracking-wider'>
              — The GlowNest Formulation Collective
            </p>
          </div>

          <div>
            <Link 
              to='/collection' 
              className='inline-block bg-black text-white text-xs sm:text-sm font-medium px-8 py-3.5 rounded-sm hover:bg-gray-800 transition-colors shadow-sm cursor-pointer'
            >
              EXPLORE OUR COLLECTION
            </Link>
          </div>
        </div>
      </div>

      {/* Brand Metrics Strip */}
      <div className='my-16 py-10 px-6 bg-stone-100/70 border border-stone-200 rounded-2xl'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-stone-200'>
          <div className='pt-4 md:pt-0'>
            <p className='text-3xl sm:text-4xl font-semibold text-gray-900'>98%</p>
            <p className='text-xs sm:text-sm text-gray-500 mt-1 uppercase tracking-wider'>Natural Origin Actives</p>
          </div>
          <div className='pt-4 md:pt-0'>
            <p className='text-3xl sm:text-4xl font-semibold text-gray-900'>100%</p>
            <p className='text-xs sm:text-sm text-gray-500 mt-1 uppercase tracking-wider'>Cruelty-Free & Vegan</p>
          </div>
          <div className='pt-4 md:pt-0'>
            <p className='text-3xl sm:text-4xl font-semibold text-gray-900'>25k+</p>
            <p className='text-xs sm:text-sm text-gray-500 mt-1 uppercase tracking-wider'>Glow Rituals Delivered</p>
          </div>
          <div className='pt-4 md:pt-0'>
            <p className='text-3xl sm:text-4xl font-semibold text-gray-900'>4.9 ★</p>
            <p className='text-xs sm:text-sm text-gray-500 mt-1 uppercase tracking-wider'>Customer Satisfaction</p>
          </div>
        </div>
      </div>

      {/* Core Brand Pillars Grid */}
      <div className='my-20'>
        <div className='text-center max-w-xl mx-auto mb-12'>
          <span className='text-xs uppercase tracking-widest text-orange-600 font-semibold'>Our Standards</span>
          <h3 className='text-2xl sm:text-3xl font-medium text-gray-900 mt-2'>The Four Pillars of GlowNest</h3>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div className='p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow'>
            <div className='w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4'>
              01
            </div>
            <h4 className='font-semibold text-base text-gray-900 mb-2'>Zero Harsh Toxins</h4>
            <p className='text-xs sm:text-sm text-gray-500 leading-relaxed'>
              Formulated without parabens, sulfates, silicones, synthetic dyes, or petroleum-based fillers.
            </p>
          </div>

          <div className='p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow'>
            <div className='w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4'>
              02
            </div>
            <h4 className='font-semibold text-base text-gray-900 mb-2'>Bioactive Botanicals</h4>
            <p className='text-xs sm:text-sm text-gray-500 leading-relaxed'>
              Cold-pressed rosehip, organic aloe vera, plant ceramides, and fermented probiotics for true barrier repair.
            </p>
          </div>

          <div className='p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow'>
            <div className='w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4'>
              03
            </div>
            <h4 className='font-semibold text-base text-gray-900 mb-2'>Mindful Packaging</h4>
            <p className='text-xs sm:text-sm text-gray-500 leading-relaxed'>
              Sustainable amber glass containers to protect active formulas from UV degradation and reduce plastic waste.
            </p>
          </div>

          <div className='p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow'>
            <div className='w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center font-bold mb-4'>
              04
            </div>
            <h4 className='font-semibold text-base text-gray-900 mb-2'>Sensitive Skin Friendly</h4>
            <p className='text-xs sm:text-sm text-gray-500 leading-relaxed'>
              Non-comedogenic, pH-balanced formulas thoroughly tested to comfort even delicate and reactive skin types.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className='my-20'>
        <div className='text-2xl text-center mb-10'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-sm mb-16'>
          <div className='border border-gray-200 p-8 rounded-xl bg-white hover:border-black transition-colors'>
            <b className='text-base text-gray-900 block mb-2'>Rigorous Quality Assurance</b>
            <p className='text-gray-500 leading-relaxed'>
              Every batch undergoes strict stability, microbial, and dermatological evaluations to guarantee unmatched purity and shelf freshness.
            </p>
          </div>
          <div className='border border-gray-200 p-8 rounded-xl bg-white hover:border-black transition-colors'>
            <b className='text-base text-gray-900 block mb-2'>Fast & Secure Shopping</b>
            <p className='text-gray-500 leading-relaxed'>
              Enjoy seamless ordering, real-time live order tracking, express dispatch across India, and Cash on Delivery support.
            </p>
          </div>
          <div className='border border-gray-200 p-8 rounded-xl bg-white hover:border-black transition-colors'>
            <b className='text-base text-gray-900 block mb-2'>7-Day Easy Exchange</b>
            <p className='text-gray-500 leading-relaxed'>
              Our beauty specialists and customer care team are always on standby to assist with routine advice and hassle-free replacements.
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <NewsletterBox />
    </div>
  )
}

export default About
