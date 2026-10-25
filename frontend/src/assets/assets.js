import logo from './logo-mark.png'
import search_icon from './search_icon.png'
import profile_icon from './profile_icon.png'
import cart_icon from './cart_icon.png'
import bin_icon from './bin_icon.png'
import menu_icon from './menu_icon.png'
import dropdown_icon from './dropdown_icon.png'
import hero_img from './hero-skincare.png'
import rose_serum from './product-rose-serum.png'
import cloud_cream from './product-cloud-cream.png'
import velvet_lipstick from './product-velvet-lipstick.png'
import silk_hair_oil from './product-silk-hair-oil.png'
import exchange_icon from './exchange_icon.png'
import quality_icon from './quality_icon.png'
import support_img from './support_img.png'
import aloe_cleanser from './Aloe_Silk_Face_Cleanser.png'
import petal_toner from './Petal_Fresh_Hydrating_Toner.png'
import glass_lip_gloss from './Glass_Rose_Lip_Gloss.png'
import soft_blush from './Soft_Flush_Blush Compact.png'
import blossom_shampoo from './Blossom_Smooth_Shampoo.png'
import cloud_conditioner from './Cloud_Soft_Conditioner.png'
import cross_icon from './cross_icon.png'
import star_icon from './star_icon.png'
import star_dull_icon from './star_dull_icon.png'
import about_img from './about_editorial.png'
import contact_img from './contact_img.png'
import razorpay_logo from './razorpay_logo.png'
import stripe_logo from './stripe_logo.png'


export const assets = {
  logo,
  search_icon,
  profile_icon,
  cart_icon,
  bin_icon,
  menu_icon,
  dropdown_icon,
  hero_img,
  rose_serum,
  cloud_cream,
  velvet_lipstick,
  silk_hair_oil,
  exchange_icon,
  quality_icon,
  support_img,
  aloe_cleanser,
  petal_toner,
  glass_lip_gloss,
  soft_blush,
  blossom_shampoo,
  cloud_conditioner,
  cross_icon,
  star_icon,
  star_dull_icon,
  about_img,
  contact_img,
  razorpay_logo,
  stripe_logo
  
}

export const products = [
  {
    _id: 'aaaaa',
    name: 'Rose Dew Barrier Serum',
    description: 'A lightweight serum for hydrated, glowing skin.',
    price: 799,
    image: [rose_serum],
    category: 'Skincare',
    subCategory: 'Serum',
    sizes: ['30ml', '50ml'],
    date: 1716634345448,
    bestseller: true,
  },
  {
    _id: 'aaaab',
    name: 'Cloud Veil Ceramide Cream',
    description: 'A soft daily moisturizer for a smooth skin barrier.',
    price: 899,
    image: [cloud_cream],
    category: 'Skincare',
    subCategory: 'Moisturizer',
    sizes: ['30g', '50g'],
    date: 1716621345448,
    bestseller: false,
  },
  {
    _id: 'aaaac',
    name: 'Velvet Bloom Lipstick',
    description: 'A creamy lipstick with a soft velvet finish.',
    price: 599,
    image: [velvet_lipstick],
    category: 'Makeup',
    subCategory: 'Lipstick',
    sizes: ['Rose Mist', 'Mauve Nude', 'Berry Plum'],
    date: 1716234545448,
    bestseller: true,
  },
  {
    _id: 'aaaad',
    name: 'Silk Root Nourishing Oil',
    description: 'A nourishing oil for smooth, shiny hair.',
    price: 749,
    image: [silk_hair_oil],
    category: 'Hair Care',
    subCategory: 'Hair Oil',
    sizes: ['50ml', '100ml'],
    date: 1716621345448,
    bestseller: false,
  },
  {
  _id: 'aaaae',
  name: 'Aloe Silk Face Cleanser',
  description: 'A gentle cleanser that refreshes skin without stripping moisture.',
  price: 699,
  image: [aloe_cleanser],
  category: 'Skincare',
  subCategory: 'Cleanser',
  sizes: ['100ml', '150ml'],
  date: 1716634345450,
  bestseller: false,
},
{
  _id: 'aaaaf',
  name: 'Petal Fresh Hydrating Toner',
  description: 'A calming toner that hydrates and preps skin for your routine.',
  price: 649,
  image: [petal_toner],
  category: 'Skincare',
  subCategory: 'Toner',
  sizes: ['100ml', '150ml'],
  date: 1716634345451,
  bestseller: true,
},
{
  _id: 'aaaag',
  name: 'Glass Rose Lip Gloss',
  description: 'A glossy rose lip tint with a soft, glass-like shine.',
  price: 549,
  image: [glass_lip_gloss],
  category: 'Makeup',
  subCategory: 'Lip Gloss',
  sizes: ['Clear Rose', 'Pink Glaze'],
  date: 1716634345452,
  bestseller: false,
},
{
  _id: 'aaaah',
  name: 'Soft Flush Blush Compact',
  description: 'A silky blush compact for a natural soft-focus glow.',
  price: 699,
  image: [soft_blush],
  category: 'Makeup',
  subCategory: 'Blush',
  sizes: ['Petal Pink', 'Rose Nude'],
  date: 1716634345453,
  bestseller: true,
},
{
  _id: 'aaaai',
  name: 'Blossom Smooth Shampoo',
  description: 'A smoothing shampoo that gently cleanses and softens hair.',
  price: 799,
  image: [blossom_shampoo],
  category: 'Hair Care',
  subCategory: 'Shampoo',
  sizes: ['250ml', '400ml'],
  date: 1716634345454,
  bestseller: false,
},
{
  _id: 'aaaaj',
  name: 'Cloud Soft Conditioner',
  description: 'A creamy conditioner for smooth, soft, easy-to-manage hair.',
  price: 849,
  image: [cloud_conditioner],
  category: 'Hair Care',
  subCategory: 'Conditioner',
  sizes: ['250ml', '400ml'],
  date: 1716634345455,
  bestseller: true,
},
]