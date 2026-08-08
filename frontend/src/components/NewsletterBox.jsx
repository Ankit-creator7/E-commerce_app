import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
        // Handle form submission logic here
    };

    return (
        <div className='text-center'>
            <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
            <p className='text-gray-400 mt-3'>
                Join our glow list for fresh beauty drops, skincare tips, and exclusive offers made for your daily routine.
            </p>
            <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center mx-auto my-6 border border-gray-400'>
                <input
                    className='w-full sm:flex-1 outline-none px-4 py-3 text-sm'
                    type="email"
                    placeholder='Enter your email'
                    required
                />
                <button
                    type='submit'
                    className='bg-black text-white text-sm px-6 py-3 cursor-pointer'
                >
                    SUBSCRIBE
                </button>
            </form>

        </div>
    )
}

export default NewsletterBox
