import Order from "../models/order.js";
import Product from "../models/Product.js";
import stripe from 'stripe';

export const placeOrderCOD = async (req,res) => {
    try {
        const  userId  = req.userId;
        const { items, address } = req.body;
        if(!address || !items.length === 0 ){
            return res.json({success:false,message:"Invaild data"})
        }

        let amount = await items.reduce(async (acc,item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice*item.quantity;
        },0)
        amount+=Math.floor(amount*0.02)

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"COD",
        });

        return res.json({success:true,message:"Order Placed Successfully"})
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message});
    }
}

export const placeOrderStripe = async (req,res) => {
    try {
        const  userId  = req.userId;

        const { origin } = req.headers

        const { items, address } = req.body;
        if(!address || !items.length === 0 ){
            return res.json({success:false,message:"Invaild data"})
        }

        let productData = [];

        let amount = await items.reduce(async (acc,item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name:product.name,
                price:product.offerPrice,
                quantity:item.quantity
            })
            return (await acc) + product.offerPrice*item.quantity;
        },0)
        amount+=Math.floor(amount*0.02)

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType:"Online",
        });

        const stripeInstance = new stripe(process.env.STRIP_SECRET_KEY)

        const line_items = productData.map((item)=>{
            return {
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:item.name,
                    },
                    unit_amount:Math.floor(item.price + item.price * 0.02)*100
                },
                quantity:item.quantity,
            }
        })

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode:"payment",
            success_url:`${origin}/loader?next=my-orders`,
            cancel_url:`${origin}/cart`,
            metadata:{
                orderId:order._id.toString(),
                userId,
            }
        })

        return res.json({success:true,url:session.url});
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message});
    }
}

export const getUserOrders = async (req,res) => {
    try {
        const  userId  = req.userId;
        const orders = await Order.find({userId,$or:[{paymentType:"COD"},{ispaid:true}]}).populate("items.product address").sort({createdAt:-1});
        res.json({success:true,orders});
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message});
    }
}


export const getAllOrders = async (req,res) => {
    try {
        const orders = await Order.find({$or:[{paymentType:"COD"},{ispaid:true}]}).populate("items.product address").sort({createdAt:-1});
        res.json({success:true,orders});
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message});
    }
}