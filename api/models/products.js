const moongose = require("mongoose");

const productSchema = moongose.Schema({
  _id: moongose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

module.exports = moongose.model("Product", productSchema);
