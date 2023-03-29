const mongoose = require('mongoose');
const {Schema} = mongoose;

const inventoryItems = Schema({    
    SKU: {
        type: Number,
        unique: true,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    Category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    Quantity: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
   
    
})

const items = mongoose.model('items',inventoryItems);

module.exports = items;