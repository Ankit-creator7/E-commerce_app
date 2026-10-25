import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Please login to place an order" });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Ensure this is a valid customer token with a valid user ID
        if (!token_decode || typeof token_decode !== 'object' || !token_decode.id) {
            return res.json({ 
                success: false, 
                message: "Active session is not a customer account. Please logout and login as a customer." 
            });
        }

        req.body = req.body || {};
        req.body.userId = token_decode.id;
        req.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Session expired or invalid, please login again" });
    }
};

export default authUser;
