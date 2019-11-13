const moongose = require("mongoose");

const productSchema = moongose.Schema({
  _id: moongose.Schema.Types.ObjectId,
  name: String,
  price: Number
});

module.exports = moongose.model("Product", productSchema);
