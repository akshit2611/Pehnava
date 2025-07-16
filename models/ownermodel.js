const { default: mongoose } = require("mongoose");

// mongoose.connect('mongodb://localhost:27017/Pehnava-By-surbhi', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log("Connected to MongoDB successfully");
// }).catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
// });

 const ownerSchema=mongoose.Schema({
    name: String,
    email: String,Number,
    password: Number,String,
    products: {
      type: Array,
      default: []
    },
});
module.exports = mongoose.model('User', ownerSchema);