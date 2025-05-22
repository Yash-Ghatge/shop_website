import express from 'express'
import authSeller from '../middleware/authSeller.js'
import { updateCart } from '../controllers/cartControoler.js'

const cartRouter = express.Router()

cartRouter.post('/update',authSeller,updateCart)

export default cartRouter;