import React, { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Account created successfully');
        } else {
          toast.error(response.data.message);
        }
      } else if (currentState === 'Login') {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Logged in successfully');
        } else {
          toast.error(response.data.message);
        }
      } else if (currentState === 'Reset Password') {
        const response = await axios.post(backendUrl + '/api/user/forgot-password', { email });
        if (response.data.success) {
          toast.success(response.data.message || 'Password reset link sent to your email.');
          setCurrentState('Login');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(token) {
      navigate('/');
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState === 'Reset Password' ? 'Reset Password' : currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {currentState === 'Reset Password' && (
        <p className='text-xs text-center text-gray-500 mb-2'>
          Enter your registered email address and we will send you password reset instructions.
        </p>
      )}

      {currentState === 'Sign Up' && (
        <input 
          onChange={(e) => setName(e.target.value)} 
          value={name} 
          type="text" 
          className='w-full px-3 py-2 border border-gray-800' 
          placeholder='Full Name' 
          required 
        />
      )}

      <input 
        onChange={(e) => setEmail(e.target.value)} 
        value={email} 
        type="email" 
        className='w-full px-3 py-2 border border-gray-800' 
        placeholder='Email' 
        required 
      />

      {currentState !== 'Reset Password' && (
        <input 
          onChange={(e) => setPassword(e.target.value)} 
          value={password} 
          type="password" 
          className='w-full px-3 py-2 border border-gray-800' 
          placeholder='Password' 
          required 
        />
      )}

      <div className='w-full flex justify-between text-sm mt-[8px]'>
        {currentState === 'Login' ? (
          <>
            <p onClick={() => setCurrentState('Reset Password')} className='cursor-pointer text-gray-600 hover:text-black'>
              Forgot your password?
            </p>
            <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer font-medium hover:underline'>
              Create Account
            </p>
          </>
        ) : currentState === 'Sign Up' ? (
          <>
            <p></p>
            <p onClick={() => setCurrentState('Login')} className='cursor-pointer font-medium hover:underline'>
              Login Here
            </p>
          </>
        ) : (
          <>
            <p onClick={() => setCurrentState('Login')} className='cursor-pointer text-gray-600 hover:text-black'>
              Back to Login
            </p>
            <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer font-medium hover:underline'>
              Create Account
            </p>
          </>
        )}
      </div>

      <button 
        disabled={loading}
        className='bg-black text-white font-light px-8 py-2 mt-4 cursor-pointer hover:bg-gray-800 transition-colors disabled:opacity-50'
      >
        {loading ? 'Please wait...' : (currentState === 'Login' ? 'Sign In' : currentState === 'Sign Up' ? 'Sign Up' : 'Send Reset Link')}
      </button>
    </form>
  )
}

export default Login
