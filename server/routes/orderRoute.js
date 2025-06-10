import express from 'express'
import {  getAllOrders, getUserOrders, placeOrderCOD, placeOrderStripe } from '../controllers/orderController.js'
import authUser from '../middleware/authUser.js';
import authSeller from '../middleware/authSeller.js';

const orderRoute = express.Router()

orderRoute.post('/cod',authUser,placeOrderCOD)
orderRoute.get('/user',authUser,getUserOrders)
orderRoute.get('/seller',authSeller,getAllOrders)
orderRoute.post('/stripe',authUser,placeOrderStripe)

export default orderRoute;