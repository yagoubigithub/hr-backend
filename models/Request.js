const mongoose = require("mongoose");

const     ObjectId =  mongoose.Schema.ObjectId;



const RequestSchema = new mongoose.Schema({
  
    userId : { type : ObjectId, ref: 'User' },
    start_date : {
        type : String,
        
        
    },
    end_date : {
        type : String,
        
        
    },
    request_type : {
        type : String,
        required : true,
    },
    reason : {
        type : String,
        required : true,
        
    },
    state : {
        type : String,
        required : true,
        enum : ['pending','canceled' , "rejected" , "approved"],

        default :  "pending"
    }
  

}, {timestamps : true})




module.exports = mongoose.model("Request", RequestSchema)