const express = require('express');
const User = require('../Controllers/server_controller');
const router = express.Router();
const multer = require('multer');
const isAuthenticated = require('../middlewares/isAuthenticate');
const cloudinary = require('cloudinary')
const path = require('path');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'..','/uploads/avatar/'));
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '.'+ extension);
    }
});

let storages = multer.diskStorage({
    
    destination: function(req,file,cb){
        console.log('rre');
        cb(null,path.join(__dirname,'..','/uploads/items/'));
    },
    filename: function(req,file,cb){
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '.'+ extension);
    }
})

const upload = multer({ storage }).single('avatar');
const uploadItem = multer({ storage: storages }).single('image');

const imageMiddleWare = async(req,res,next) =>{
   
    try{
        console.log(req.file);
       const options =   { transformation: [
        { dpr: "auto", responsive: true, width: "auto",  }, 
        { effect: "art:hokusai", border: "3px_solid_rgb:00390b", radius: 20 }
        ]} 
      
      if(req.file){
         const result = await cloudinary.v2.uploader.upload(req.file.path,options);
         console.log('running');
         req.image = result;    
        }      
    }
    catch (error) {
        console.log(error);
    }

next();

}

router.get('/',User.index)
router.post('/forgot',User.forgotPass);
router.put('/resetPassword/:id',User.resetPassword);
router.post('/newUser',User.newUser);
router.post('/login',User.Login);

router.post('/items',isAuthenticated,uploadItem,imageMiddleWare,User.items);
router.get('/getItems/',isAuthenticated,User.getItems);
router.delete('/delItems/:id',isAuthenticated,User.delItem);
router.get('/getItem/:id',isAuthenticated,User.getItemByID);
router.get('/getprofile',isAuthenticated,User.getProfile);
router.post('/editProfile/',isAuthenticated,upload,imageMiddleWare,User.editProfile);
router.put('/updateItem/:id',isAuthenticated,User.updateItem)
router.get('/dashboard',isAuthenticated,User.homepage)
router.post('/report',isAuthenticated,User.report)
router.get('/logout',isAuthenticated,User.Logout);

module.exports = router;