const express = require('express');

const router = express.Router();

const
{
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getOneUser,
    uploadUserImage,
    resizeImage,
    changePassword,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deleteLoggedUserAccount,

} = require('../services/userServices');


const 
{
    createUserValidator,
    updateUserValidator,
    getOneUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator
} = require('../utils/validators/userValidator');


const authServices = require('../services/authServices');
//---------------------------------------------------------
// router.use(authServices.protect, authServices.allowedTo('manger', 'admin'));


router.get('/getme', authServices.protect, getLoggedUserData, getOneUser);

router.put('/changemypassword', authServices.protect, updateLoggedUserPassword);


router.put('/updateloggeduserdata', authServices.protect, updateUserValidator, updateLoggedUserData);

router.delete('/deleteuserloggedaccount', authServices.protect, deleteLoggedUserAccount);


router.route('/changepassword/:id')
.put(changeUserPasswordValidator, changePassword);   

router.route('/')
.post
(
    authServices.protect,
    authServices.allowedTo('admin'),
    uploadUserImage, 
    resizeImage, 
    createUserValidator, 
    createUser
)
.get
(
    authServices.protect,
    authServices.allowedTo('admin', 'manger'),    
    getAllUsers
);

router.route('/:id')
.get
(
    authServices.protect,
    authServices.allowedTo('admin'),
    getOneUserValidator, 
    getOneUser
)
.put
(
    authServices.protect,
    authServices.allowedTo('admin'),
    uploadUserImage, 
    resizeImage, 
    updateUserValidator, 
    updateUser
)
.delete
(
    authServices.protect,
    authServices.allowedTo('admin'),
    deleteUserValidator, 
    deleteUser

);

module.exports = router;