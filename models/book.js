const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: String,
  genre: String,
  time: String,
  size: String,
  authorId: String,
});

// 存到数据库中后是复数形式
module.exports = mongoose.model('Book', bookSchema);
