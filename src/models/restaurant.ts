import mongoose from "mongoose"

const menuItemSchema = new mongoose.Schema({
  name: {type: String, required: true},
  price: {type: String, required: true}
})

const restaurantSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:"User"}, // we're creating a reference to the user document for the user who is creating a given restaurant. ref means its going to user model and create the link between that user and this restaurant.
  restaurantName: {type: String, required: true},
  city: {type: String, required: true},
  country: {type: String, required: true},
  deliveryPrice: {type: Number, required: true},
  estimatedDeliveryTime: {type: Number, required: true},
  cuisines: [{type: String, required: true}],
  menuItems:[menuItemSchema],
  imageUrl: {type: String, required: true},
  lastUpdated: {type: Date, required: true}
})

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant