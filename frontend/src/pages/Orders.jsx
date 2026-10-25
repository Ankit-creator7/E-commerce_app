import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'

const ORDER_STEPS = [
  'Order Placed',
  'Packing',
  'Shipped',
  'Out for delivery',
  'Delivered'
];

const Orders = () => {
  const { backendUrl, token, currency, navigate } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trackingItem, setTrackingItem] = useState(null);

  const loadOrderData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItems = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item.orderId = order._id;
            item.status = order.status || 'Order Placed';
            item.payment = order.payment;
            item.paymentMethod = order.paymentMethod;
            item.date = order.date;
            item.address = order.address;
            allOrdersItems.push(item);
          });
        });

        setOrderData(allOrdersItems.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadOrderData();
    }
  }, [token]);

  if (!token) {
    return (
      <div className='border-t pt-16 text-center min-h-[50vh] flex flex-col items-center justify-center'>
        <p className='text-xl text-gray-700 font-medium mb-4'>Please log in to view your orders</p>
        <button 
          onClick={() => navigate('/login')} 
          className='bg-black text-white text-sm px-8 py-3 cursor-pointer hover:bg-gray-800'
        >
          Sign In
        </button>
      </div>
    );
  }

  const getStepIndex = (status) => {
    const normalized = (status || '').toLowerCase();
    if (normalized.includes('delivered')) return 4;
    if (normalized.includes('out for delivery')) return 3;
    if (normalized.includes('shipped')) return 2;
    if (normalized.includes('packing')) return 1;
    return 0; // Order Placed
  };

  return (
    <div className='border-t pt-16 min-h-[70vh]'>
      <div className='text-2xl mb-6'>
        <Title text1={'YOUR'} text2={'ORDERS'} />
      </div>

      {loading ? (
        <div className='text-center py-20 text-gray-500'>Loading orders...</div>
      ) : orderData.length === 0 ? (
        <div className='text-center py-20 text-gray-500'>
          <p className='text-lg font-medium mb-3'>You have no orders yet</p>
          <button 
            onClick={() => navigate('/collection')} 
            className='bg-black text-white text-sm px-6 py-2.5 cursor-pointer hover:bg-gray-800'
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div>
          {orderData.map((item, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20 object-cover rounded' src={item.image?.[0]} alt={item.name} />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                    <p className='text-lg font-semibold'>{currency}{item.price}</p>
                    <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
                    <p className='text-xs px-2 py-0.5 bg-gray-100 rounded border'>Variant: {item.size}</p>
                  </div>
                  <p className='mt-2 text-xs text-gray-500'>
                    Date: <span className='text-gray-700 font-medium'>{new Date(item.date).toDateString()}</span>
                  </p>
                  <p className='mt-1 text-xs text-gray-500'>
                    Payment: <span className='text-gray-700 font-medium'>{item.paymentMethod} ({item.payment ? 'Paid' : 'Pending'})</span>
                  </p>
                </div>
              </div>
              <div className='md:w-1/2 flex items-center justify-between gap-4'>
                <div className='flex items-center gap-2'>
                  <p className={`min-w-2.5 h-2.5 rounded-full ${item.status === 'Delivered' ? 'bg-green-600' : 'bg-orange-500'}`}></p>
                  <p className='text-sm md:text-base font-medium'>{item.status}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <button 
                    onClick={() => setTrackingItem(item)} 
                    className='border border-black px-4 py-2 text-sm font-medium rounded-sm cursor-pointer hover:bg-black hover:text-white transition-colors'
                  >
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tracking Modal */}
      {trackingItem && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg max-w-lg w-full p-6 shadow-xl relative'>
            <div className='flex justify-between items-start pb-4 border-b'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900'>Live Order Tracking</h3>
                <p className='text-xs text-gray-500 mt-1'>Order ID: {trackingItem.orderId}</p>
              </div>
              <button 
                onClick={() => setTrackingItem(null)} 
                className='text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer'
              >
                &times;
              </button>
            </div>

            <div className='my-6 space-y-4'>
              <div className='flex items-center gap-4 bg-gray-50 p-3 rounded'>
                <img src={trackingItem.image?.[0]} className='w-14 h-14 object-cover rounded' alt="" />
                <div>
                  <p className='font-medium text-sm text-gray-800'>{trackingItem.name}</p>
                  <p className='text-xs text-gray-500 mt-0.5'>Variant: {trackingItem.size} | Qty: {trackingItem.quantity}</p>
                  <p className='text-xs font-semibold mt-1'>{currency}{trackingItem.price}</p>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className='pt-2'>
                <div className='relative flex flex-col gap-6 pl-6 border-l-2 border-gray-200 ml-4'>
                  {ORDER_STEPS.map((step, idx) => {
                    const currentIdx = getStepIndex(trackingItem.status);
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={idx} className='relative'>
                        <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 bg-white ${
                          isCompleted ? 'border-green-600 bg-green-600' : 'border-gray-300'
                        }`} />
                        <div>
                          <p className={`text-sm font-medium ${isCurrent ? 'text-black font-bold' : isCompleted ? 'text-green-700' : 'text-gray-400'}`}>
                            {step}
                          </p>
                          {isCurrent && (
                            <p className='text-xs text-orange-600 font-normal mt-0.5'>Current Status</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {trackingItem.address && (
                <div className='mt-4 p-3 bg-slate-50 rounded text-xs text-gray-600'>
                  <p className='font-semibold text-gray-800 mb-1'>Shipping To:</p>
                  <p>{trackingItem.address.firstName} {trackingItem.address.lastName}</p>
                  <p>{trackingItem.address.street}, {trackingItem.address.city}, {trackingItem.address.state} - {trackingItem.address.zipcode || trackingItem.address.zipCode}</p>
                  <p>Phone: {trackingItem.address.phone}</p>
                </div>
              )}
            </div>

            <div className='flex justify-end gap-3 pt-3 border-t'>
              <button 
                onClick={() => {
                  loadOrderData();
                  toast.success('Order status refreshed');
                }} 
                className='text-xs font-medium border px-4 py-2 rounded cursor-pointer hover:bg-gray-100'
              >
                Refresh Status
              </button>
              <button 
                onClick={() => setTrackingItem(null)} 
                className='text-xs font-medium bg-black text-white px-5 py-2 rounded cursor-pointer hover:bg-gray-800'
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

export default Orders
