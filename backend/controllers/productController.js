import {v2 as cloudinary} from "cloudinary";
import productModel from "../models/productModel.js";

// Function for add product
const addProduct = async (req, res) => {
    try {
        const {name, description, price, category, subcategory, variant, bestseller, costPrice, stock} = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        );

        const numericPrice = Number(price);
        const parsedCostPrice = costPrice !== undefined && costPrice !== "" ? Number(costPrice) : Math.round(numericPrice * 0.6);
        const parsedStock = stock !== undefined && stock !== "" ? Number(stock) : 25;

        const productData = {
            name,
            description,
            price: numericPrice,
            costPrice: parsedCostPrice,
            stock: parsedStock,
            category,
            subCategory: subcategory,
            bestseller: bestseller === "true" || bestseller === true,
            variant: typeof variant === "string" ? JSON.parse(variant) : variant,
            image: imagesUrl,
            date: Date.now()
        };

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product added successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function for list product
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function for remove product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function for update product stock and cost
const updateStock = async (req, res) => {
    try {
        const { id, stock, costPrice } = req.body;
        const updateData = {};
        if (stock !== undefined) updateData.stock = Number(stock);
        if (costPrice !== undefined) updateData.costPrice = Number(costPrice);
        await productModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Stock updated successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addProduct, listProducts, removeProduct, singleProduct, updateStock };
