const express = require('express');

const router = express.Router();

const
{
    addAdressToUser,
    removeAddressFromUser,
    getUserLoggedAddress,
} = require('../services/adressServices');

const authServices = require('../services/authServices');

//------------------------------------------------------


router.route('/')
.post(authServices.protect, authServices.allowedTo('user'), addAdressToUser)
.get(authServices.protect, authServices.allowedTo('user'), getUserLoggedAddress);

router.route('/:addressId')
.delete(authServices.protect, authServices.allowedTo('user'), removeAddressFromUser);




module.exports = router;