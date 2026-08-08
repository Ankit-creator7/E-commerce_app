import React from 'react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const Verify = () => {


    const {navigate,token,setCartItems,backendUrl} = useContext(ShopContext);
    const [searchparams,setSearchparams] = useSearchParams();

    const success = searchparams.get("success");
    const orderId = searchparams.get("orderId");

    const verifyPayment = async () => {
      try{
        if(!token){
          return null;
        }

        const response = await axios.post(backendUrl + '/api/verifyStripe', {success, orderId},{headers:{token}})

        if(response.data.success){
          setCartItems([]);
          navigate('/orders')
        } else{
          navigate('/cart')
        }
          
        
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }

    }

    useEffect(() => {
      verifyPayment();
    },[token])
    return (
    <div>

      
    </div>
  )
}

export default Verify
