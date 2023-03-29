const  registers = require('../DbSchema/register.js');
const items = require('../DbSchema/items');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
exports.newUser = async(req,res)=>{
    try {
         console.log(req.body); 
                  
        const data = await registers.create(req.body)
        
        await data.save(function(Err){
            if(Err) console.log(Err);
            res.status(200).json({success: 'success'})
        });
    
    } catch (error){   
         
        res.status(404).json({err: error.message});
    }
    
}

exports.forgotPass = async(req,res) => {
    const email = req.body.email;
    console.log(req.body);
    const confirm = await registers.findOne({email: email});
    if(confirm){
        console.log(confirm);
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth:{
                user: process.env.id,
                pass: process.env.pass
            },
    
        });
        let info = await transporter.sendMail({
            from: confirm.email, // sender address
            to: "sanjaykandpal4@gmail.com", // list of receivers
            subject: 'request for change in password', // Subject line
            html: `<h1>Hello ${confirm.name}</h1><h4>You requested for a password reset
            Please use the give link below to reset your password
            This reset link is valid only for 30 minutes</h4>
                    <a href=http://localhost:3000/resetPassword/${confirm._id}>http://localhost:3000/resetPassword/${confirm._id}</a><p>Regards</p>` // plain text body
          });
          console.log("Message sent: %s", info.messageId);
          res.status(200).json({success: 'success'});

    }else{
      res.send('re enter your email');
      res.redirect('/forgot')
    }
}

exports.resetPassword = async(req,res) => {
    console.log(req.body);
    console.log(req.params.id);
    if(req.body.password === req.body.cPassword){
      registers.findByIdAndUpdate(req.params.id,{password: req.body.password,cPassword: req.body.cPassword}).exec(function(err,doc){
        if(err) {console.log(err);
        res.status(200).json({error: err})}
        // saved 
        res.status(200).json({success: 'success'});
      })
      
    }else{
        res.redirect(req.get('referer'));
    }
}

function generateToken(id){
    return jwt.sign({id: id},'fu',{
        expiresIn: 604800 //in seconds
    })
}

exports.Login = async(req,res) =>{
    try {
        
        const data = await registers.findOne({$and: [{email: req.body.email},{password: req.body.password}]});
        if(data){
            const id = {id: data.id};
            
            const token =  generateToken(id);
            res.setHeader('Authorization',token);
            res.cookie('jwt',token) 
            res.setHeader('Authorization',token);
            res.status(200).json({
                token: token,
                user: id,
                success: 'success'
            });
        }else{
            res.status(404).send({success : "failure", redirect_path: "/"});
        }
       
    } catch (error) {
        console.log(error);
        res.status(404).send({err: error.message})
    }
}
exports.index = (req,res) =>{
    try {
        res.send('index page');
    } catch (error) {
        res.status(404).json({err: error.message})
    }
}

exports.homepage = (req,res) =>{
    try {     
        res.send('homepage dashboard')    
    } catch (error) {
        res.status(404).json({err: error.message})      
    }
}

exports.getProfile = async(req,res) => {
   try{ 
     console.log(req.user.id);
      const data = await registers.findById({_id: req.user.id.id})
      res.status(200).json(data);
    } catch (error) {
        console.log(error);
    }
    
}

exports.editProfile = async(req,res) =>{
    try {
        console.log(req.image);
        if(req.image){
            const data = await registers.findByIdAndUpdate(req.user.id.id,{ ...req.body,image: req.image.url}).exec();
            data.save();
            // console.log(data);
            res.status(200).json(data);
        }else{
            const data = await registers.findByIdAndUpdate(req.user.id.id,{ ...req.body}).exec();
        data.save();
        // console.log(data);
        res.status(200).json(data);
        }
        
    } catch (error) {
        res.status(404).json(error.message);
    }
}

exports.items = async(req,res) =>{
    try {    console.log(req.image);
           console.log(req.body);  
           
           
        const itemData =  await items.create({
            ...req.body,image: req.image.url,     
        });
        registers.findByIdAndUpdate(req.user.id.id,{
            $push: {item: itemData._id}
        },function(err,doc){
            if(err)
            console.log(err);
            //saved
        });
     
        await itemData.save();
        res.status(200).json(itemData);       
    } catch (error) {
        res.status(404).json({err: error.message})
    }
 
}

exports.getItems = async(req,res) =>{
    try {          
        console.log(req.user.id.id);
        const v = await registers.findById(req.user.id.id).populate('item').exec();
        res.status(200).json(v)
    } catch (error) {
        res.status(404).json({err: error.message})
    }
}

exports.updateItem = async(req,res) =>{
    try {
        console.log(req.body);
        items.findByIdAndUpdate(req.params.id,{...req.body},function(err,doc){
            if(err) console.log(err);
            // saved
            console.log(doc);
        })
    } catch (error) {
        console.log(error);
    }
}
exports.delItem = (req,res) =>{
  try {
    console.log(req.params.id);
    items.findByIdAndDelete(req.params.id,function(err,doc){
        if(err) console.log(err);
        res.status(200).json(doc);
    })
  } catch (error) {
    console.log(error);
  }
}

exports.getItemByID = (req,res) =>{
    try {
        console.log(req.params.id);
        items.findById(req.params.id,function(err,doc){
            if(err) console.log(err);
            res.status(200).json(doc);
        })
    } catch (error) {
        console.log(error);
    }
}

exports.report = async(req,res) => {
    try {
        const data = await registers.findById(req.user.id.id).exec();
        console.log(data);
        
       
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth:{
                user: process.env.id,
                pass: process.env.pass
            },
    
        });
        let info = await transporter.sendMail({
            from: data.email, // sender address
            to: "sanjaykandpal4@gmail.com", // list of receivers
            subject: req.body.subject, // Subject line
            html: `<b>${req.body.message}</b>` // plain text body
            
          });
          console.log("Message sent: %s", info.messageId);
          res.status(200).json({success: 'success'});
    } catch (error) {
        console.log(error);        
        res.status(200).json({err: error.message});
    }
    
}

exports.Logout =(req,res) =>{
    try {
        console.log(res);
    } catch (error) {
        console.log(error.message);
    }   
}