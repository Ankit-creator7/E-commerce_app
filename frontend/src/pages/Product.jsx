import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext.jsx'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts.jsx'
import { toast } from 'react-toastify'

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  // Customer reviews state
  const [reviews, setReviews] = useState([
    {
      name: "Priya Sharma",
      rating: 5,
      date: "Oct 12, 2026",
      comment: "Absolutely love the texture! It absorbs quickly into the skin and gives an instant glow without feeling greasy."
    },
    {
      name: "Aman Verma",
      rating: 4,
      date: "Sep 28, 2026",
      comment: "Very high quality product. Delivery was fast and the packaging kept the bottle completely secure."
    }
  ]);

  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image?.[0] || '');
        return null;
      }
    })
  }

  useEffect(() => {
    fetchProductData();
  }, [products, productId])

  const variants = productData ? (productData.variant || productData.sizes || []) : [];

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      toast.error("Please fill in both name and review comment");
      return;
    }

    const reviewObj = {
      name: newReviewName.trim(),
      rating: Number(newReviewRating),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      comment: newReviewComment.trim()
    };

    setReviews([reviewObj, ...reviews]);
    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);
    toast.success("Thank you! Your review has been posted.");
  };

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.image && productData.image.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  src={item}
                  key={index}
                  className={`w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border ${image === item ? 'border-orange-500' : 'border-transparent'}`}
                  alt=""
                />
              ))
            }
          </div>

          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto rounded' src={image} alt="" />
          </div>
        </div>

        {/* Product Details */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>
            {productData.name}
          </h1>
          <div className='flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_icon} alt="" className='w-3.5' />
            <img src={assets.star_dull_icon} alt="" className='w-3.5' />
            <p className='pl-2 text-sm text-gray-500'>({reviews.length + 21} reviews)</p>
          </div>
          <p className='mt-5 text-xl font-medium'>{currency} {productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5 leading-relaxed'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
            <p className='text-sm font-medium text-gray-700'>Select Variant</p>
            <div className='flex gap-2 flex-wrap'>
              {
                variants.map((item, index) => (
                  <button 
                    type='button'
                    onClick={() => setSize(item)} 
                    className={`border py-2 px-4 bg-gray-100 text-sm cursor-pointer transition-all ${size === item ? 'border-orange-500 bg-orange-50 text-orange-700 font-medium' : 'border-gray-200 hover:border-gray-400'}`} 
                    key={index} 
                  >
                    {item}
                  </button>
                ))
              }
            </div>
          </div>
          <button onClick={() => addToCart(productData._id, size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 cursor-pointer hover:bg-gray-800 transition-colors'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original Product.</p>
            <p>Cash on Delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* Description and Review Section */}
      <div className='mt-20'>
        <div className='flex border-b'>
          <button 
            type='button'
            onClick={() => setActiveTab('description')} 
            className={`border-b-2 py-3 px-6 text-sm font-medium cursor-pointer transition-all ${
              activeTab === 'description' 
                ? 'border-black text-black font-semibold' 
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Description
          </button>
          <button 
            type='button'
            onClick={() => setActiveTab('reviews')} 
            className={`border-b-2 py-3 px-6 text-sm font-medium cursor-pointer transition-all ${
              activeTab === 'reviews' 
                ? 'border-black text-black font-semibold' 
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {activeTab === 'description' ? (
          <div className='flex flex-col gap-4 border border-t-0 px-6 py-6 text-sm text-gray-600 leading-relaxed bg-white'>
            <p>GlowNest products are crafted to support everyday beauty rituals with gentle formulas, soft textures, and easy-to-use variants. Each item is designed for a specific routine, whether you are refreshing your skin, adding a natural makeup finish, or caring for your hair.</p>
            <p>Choose the variant that suits your routine, such as size, shade, or finish. Always check the product details before adding to cart, and patch test skincare or hair care products if you are trying them for the first time.</p>
          </div>
        ) : (
          <div className='border border-t-0 p-6 bg-white'>
            {/* Reviews List */}
            <div className='space-y-4 mb-8'>
              {reviews.map((rev, idx) => (
                <div key={idx} className='border-b pb-4'>
                  <div className='flex items-center justify-between'>
                    <p className='font-medium text-sm text-gray-800'>{rev.name}</p>
                    <span className='text-xs text-gray-400'>{rev.date}</span>
                  </div>
                  <div className='flex items-center gap-1 my-1'>
                    {[...Array(5)].map((_, i) => (
                      <img 
                        key={i} 
                        src={i < rev.rating ? assets.star_icon : assets.star_dull_icon} 
                        className='w-3' 
                        alt="" 
                      />
                    ))}
                  </div>
                  <p className='text-xs text-gray-600 mt-1'>{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className='bg-gray-50 p-4 rounded-lg border'>
              <h4 className='text-sm font-semibold text-gray-800 mb-3'>Write a Customer Review</h4>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3'>
                <input 
                  type="text" 
                  value={newReviewName} 
                  onChange={(e) => setNewReviewName(e.target.value)} 
                  placeholder="Your Name" 
                  className="border bg-white rounded px-3 py-2 text-xs outline-none focus:border-black"
                  required
                />
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-gray-600 font-medium'>Rating:</span>
                  <select 
                    value={newReviewRating} 
                    onChange={(e) => setNewReviewRating(e.target.value)} 
                    className="border bg-white rounded px-2 py-1.5 text-xs outline-none cursor-pointer"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Below Average</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>
              </div>
              <textarea 
                value={newReviewComment} 
                onChange={(e) => setNewReviewComment(e.target.value)} 
                rows={3} 
                placeholder="Share details of your experience with this product..." 
                className="w-full border bg-white rounded p-3 text-xs outline-none focus:border-black mb-3"
                required
              />
              <button 
                type="submit" 
                className="bg-black text-white text-xs px-6 py-2 rounded cursor-pointer hover:bg-gray-800"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Displaying related products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className='opacity-0'></div>
}

export default Product
