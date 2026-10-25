import React, { useState } from 'react'
import { toast } from 'react-toastify'

const NewsletterBox = () => {
    const [email, setEmail] = useState('');

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if (!email.trim()) return;

        toast.success(`Thank you for subscribing! Your 20% discount code has been sent to ${email}`);
        setEmail('');
    };

    return (
        <div className='text-center my-12'>
            <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
            <p className='text-gray-400 mt-3 max-w-lg mx-auto text-sm'>
                Join our glow list for fresh beauty drops, skincare tips, and exclusive offers made for your daily routine.
            </p>
            <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center mx-auto my-6 border border-gray-400'>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full sm:flex-1 outline-none px-4 py-3 text-sm'
                    type="email"
                    placeholder='Enter your email address'
                    required
                />
                <button
                    type='submit'
                    className='bg-black text-white text-sm px-6 py-3 cursor-pointer hover:bg-gray-800 transition-colors'
                >
                    SUBSCRIBE
                </button>
            </form>
        </div>
    )
}

export default NewsletterBox
