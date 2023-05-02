const express = require("express");



const morgan = require("morgan");
const cors = require('cors')
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator")



dotenv.config()

const port = process.env.PORT || 4005;

const app = express();

const server = require('http').createServer(app);



mongoose.connect(process.env.MONGO_URL,{

    useNewUrlParser : true
}).then(()=>{
    console.log("database connected")
})


//import routes

const userRoutes = require("./routes/users")

const requestRoutes = require("./routes/requests")



//midelwares
app.use(cors());

app.use(express.json({ extended: false, limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }))

app.use(cookieParser());
app.use(expressValidator())

app.use(morgan("common"));


//routes midelware


app.get("/" ,  (req , res)=>{
    res.send("Hello wolrd")
})
app.use("/api/users",userRoutes)
app.use("/api/requests",requestRoutes)



 
 server.listen(port, () => console.log(`Listening on port ${port}`));