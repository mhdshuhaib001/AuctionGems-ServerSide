const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  iconUrl: { type: String, required: true },
  imageUrl: { type: String, required: true },   
  description: { type: String },             
});

const Category = mongoose.model('Category', categorySchema);

export default Category