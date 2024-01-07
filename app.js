const express = require("express")
const app = express()


const connectDb = require('./db/connect')
const productRouter = require("./routes/products")
const notFound = require("./error/not-found")
const errorHandler = require("./error/error-handler")
require('dotenv').config()
require('express-async-errors')


app.use(express.json())

app.get("/",(req,res)=>{
  res.send("<h1>Store API</h1><a href='/api/product>products route</a>'")
})




app.use("/api/product",productRouter)
app.use(errorHandler)
app.use(notFound)


const port = 5000
const start = async()=>{
  try{ await connectDb(process.env.MONGO_URI)
    app.listen(port,()=>console.log(`app listening on port ${port}`))
  }
  catch(err)
  {console.log(err);}
}
start()
