 
var mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/goog")

var userSchema = mongoose.Schema({
  profile: String,
  emails : String
})

module.exports = mongoose.model('user', userSchema)
