import express from 'express'
import authUser from '../middleware/authUser.js';
import { addAddress, getAddress } from '../controllers/addressController.js';

const addressRoute = express.Router();

addressRoute.post('/add',authUser,addAddress)
addressRoute.get('/get',authUser,getAddress)

export default addressRoute;
