const  mongoose = require("mongoose");
const {Schema} = mongoose;
const RegisterSchema =  Schema({
    name: {
     type: String,
     unique: true,
     required: true     
    },
    email: {
      type: String,
      unique: true,
      required: true  
    },
    password: {
     type: String,
     required: true
    }, 
    cPassword: {
        type: String,
        required: true
    },
    phone: {
      type: Number,
  },
  Bio: {
      type: String,
  },
  image: {
      type: String,
  },
  item: [{type: Schema.Types.ObjectId,ref: 'items'}] 
    
},{timestamps:true})

const registers = mongoose.model('registers',RegisterSchema);
module.exports =registers;