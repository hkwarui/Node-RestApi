const moongose = require("mongoose");

const productSchema = moongose.Schema({
  _id: moongose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, require: false }
});

module.exports = moongose.model("Product", productSchema);
