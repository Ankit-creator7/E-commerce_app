import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  const { backendUrl, token, setToken, setCartItems, navigate, getCartCount } = useContext(ShopContext);
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderCount, setOrderCount] = useState(0);

  const fetchProfile = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(backendUrl + '/api/user/profile', {
        headers: { token },
      });

      if (res.data.success) {
        setUserData(res.data.user);
        setName(res.data.user.name || '');
      } else {
        toast.error(res.data.message || 'Failed to load profile');
      }

      // Fetch user's order count
      const ordersRes = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      );
      if (ordersRes.data.success && Array.isArray(ordersRes.data.orders)) {
        setOrderCount(ordersRes.data.orders.length);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      const res = await axios.post(
        backendUrl + '/api/user/update-profile',
        { name },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success('Profile updated successfully');
        setUserData(res.data.user);
        setIsEditing(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
    toast.info('Logged out successfully');
    navigate('/login');
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className='min-h-[50vh] flex items-center justify-center text-gray-500'>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className='border-t pt-14 max-w-4xl mx-auto'>
      <div className='text-2xl mb-8'>
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {/* Left Column: Account Details */}
        <div className='md:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm'>
          <div className='flex justify-between items-center mb-6 pb-3 border-b'>
            <h2 className='text-lg font-medium text-gray-800'>Account Details</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className='text-sm text-gray-600 hover:text-black font-medium cursor-pointer underline'
              >
                Edit
              </button>
            ) : (
              <button
                onClick={() => {
                  setName(userData?.name || '');
                  setIsEditing(false);
                }}
                className='text-sm text-gray-400 hover:text-gray-600 cursor-pointer'
              >
                Cancel
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className='space-y-4 text-gray-700'>
              <div>
                <p className='text-xs uppercase text-gray-400 font-semibold tracking-wider'>Full Name</p>
                <p className='text-base font-medium mt-1'>{userData?.name || 'Not provided'}</p>
              </div>
              <div>
                <p className='text-xs uppercase text-gray-400 font-semibold tracking-wider'>Email Address</p>
                <p className='text-base font-medium mt-1'>{userData?.email || 'Not provided'}</p>
              </div>
              <div>
                <p className='text-xs uppercase text-gray-400 font-semibold tracking-wider'>Account ID</p>
                <p className='text-xs font-mono text-gray-500 mt-1'>{userData?._id}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className='space-y-4'>
              <div>
                <label className='block text-xs uppercase text-gray-400 font-semibold tracking-wider mb-1'>
                  Full Name
                </label>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-black'
                  required
                />
              </div>
              <div>
                <label className='block text-xs uppercase text-gray-400 font-semibold tracking-wider mb-1'>
                  Email Address (Cannot be modified)
                </label>
                <input
                  type='email'
                  value={userData?.email || ''}
                  disabled
                  className='w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm text-gray-500 cursor-not-allowed'
                />
              </div>
              <div className='flex gap-3 pt-2'>
                <button
                  type='submit'
                  className='bg-black text-white text-sm px-6 py-2 rounded-sm cursor-pointer'
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Quick Stats & Navigation */}
        <div className='flex flex-col gap-4'>
          {/* Orders Box */}
          <div className='bg-slate-50 border border-slate-200 rounded-lg p-5'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs text-gray-500 uppercase font-semibold'>Total Orders</p>
                <p className='text-2xl font-semibold text-gray-800 mt-1'>{orderCount}</p>
              </div>
              <button
                onClick={() => navigate('/orders')}
                className='text-xs font-medium bg-black text-white px-3 py-1.5 rounded cursor-pointer hover:bg-gray-800'
              >
                View Orders
              </button>
            </div>
          </div>

          {/* Cart Box */}
          <div className='bg-slate-50 border border-slate-200 rounded-lg p-5'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xs text-gray-500 uppercase font-semibold'>Items in Cart</p>
                <p className='text-2xl font-semibold text-gray-800 mt-1'>{getCartCount()}</p>
              </div>
              <button
                onClick={() => navigate('/cart')}
                className='text-xs font-medium border border-black px-3 py-1.5 rounded cursor-pointer hover:bg-black hover:text-white transition-colors'
              >
                Open Cart
              </button>
            </div>
          </div>

          {/* Logout Action */}
          <div className='mt-2'>
            <button
              onClick={logout}
              className='w-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2.5 rounded text-sm font-medium transition-colors cursor-pointer'
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
