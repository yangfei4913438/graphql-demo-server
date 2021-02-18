const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  name: String,
  age: Number,
});

// 存到数据库中后是复数形式
module.exports = mongoose.model('Author', authorSchema);
