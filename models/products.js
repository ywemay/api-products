const mongoose = require('mongoose');

const CURRENCY = process.env.CURRENCY || 'CNY';

const definition = {
  sku: {
    type: String,
    unique: true,
    maxLength: 25,
    required: true,
  },
  title: { 
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255
  },
  images: [{
    type: String,
    required: true,
  }],
  keywords: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
  },
  options: [[{
    image: String, // image to trigger when this option is choosed
    key: { type: String, required: true, maxLength: 20}, 
    title: { type: String, required: true, maxLength: 150},
    exclude: [{type: String, required: true, maxLength: 20}], // incompatible with this option keys
    limit: [{type: String, required: true, maxLength: 20}], // if selected - limit to theese keys only
    priceChange: {type: Number}
  }]],
  price: {
    type: Number, 
    default: 0
  },
  currency: {
    type: String,
    required: true,
    maxLength: 4,
    default: CURRENCY
  },
  published: {
    type: Boolean,
    default: true,
  },
}

var productSchema = new mongoose.Schema(definition);

const Product = mongoose.model('Product', productSchema);
Product.definition = definition;

module.exports = Product;