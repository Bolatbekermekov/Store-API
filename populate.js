require('dotenv').config()

const connectDb = require('./db/connect')
const Product = require('./db/models')
const jsonProducts = require("./db/products.json") 

const start = async()=>{
  try{ 
    await connectDb(process.env.MONGO_URI)
    await Product.deleteMany()
    await Product.create(jsonProducts)
    console.log("Success!!!");
    process.exit(0)
  }
  catch(err)
  {console.log(err)
    process.exit(1);
  }
  
}
start()