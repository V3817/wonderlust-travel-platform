const mongoose=require('mongoose');
const initdata=require('./data.js');
const Listing=require('../models/listing');

main()
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

async function main() {
  // Use environment variable for connection, fallback to local for init
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/project');
}

const initListings = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initdata.data);
  console.log("Sample listings inserted");
};

initListings();