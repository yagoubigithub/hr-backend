const Request = require("../models/Request");
const { errorHandler } = require("../helpers/dbErrorHandler");
const ObjectId = require('mongodb').ObjectId; 



exports.create = (req, res) => {
  const userId = req.params.userId;
  const request = new Request({ ...req.body, userId });

  request.save((err, request) => {
    if (err) {
      console.log(err, request);
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    return res.json({ success: true });
  });
};

exports.getAllRequestsByUserId = async (req, res) => {
  try {
    let requests = [];
    if(req.params.role == 1){
      requests = await Request .find({userId : req.params.userId  } ).populate("userId")
    }else{
      
      requests = await Request .find({ state :{$ne: "canceled"}  , userId : req.params.userId } ).populate("userId")
   
    }
   
    
    
    res.status(200).json(requests );
  } catch (err) {
     console.log(err)
    res.status(500).json(err);
  }

};


exports.getAllRequestsToThisManager =  async  ( req, res ) => {
  try {
    let requests = [];
    requests = await Request .find({  } ).populate("userId")
   
    requests =   requests.filter(request=>{

      if(request.userId.managerId){
        console.log( request.userId.managerId.toString()  , req.params.userId)
       return request.userId.managerId.toString()  == req.params.userId
       
      }
     
      

     
    } )
    
    res.status(200).json(requests );
  } catch (err) {
     console.log(err)
    res.status(500).json(err);
  }
}

exports.getAllRequests = async (req, res) => {
  try {
    let requests = [];
    if(req.params.role == 1){
      requests = await Request .find({userId : req.params.userId  } ).populate("userId")
    }else{
      
      requests = await Request .find({ state :{$ne: "canceled"} } ).populate("userId")
      requests = requests.filter(request=>{
       


        let o_id = new ObjectId(req.params.managerId);   

        if(request.userId.managerId)
        return request.userId.managerId.toString() == req.params.userId
        else
        return false
      })
    }
   
    
    
    res.status(200).json(requests );
  } catch (err) {
     console.log(err)
    res.status(500).json(err);
  }

};

exports.deleteRequest =  (req, res) => {
  Request.findByIdAndDelete(req.params.id, function (err, docs) {
    if (err){
      console.log(err)
      res.status(500).json(err);
    }
    else{
      res.status(200).json({
        success : true
      } );
    }
});

};


exports.updateRequestState =  (req, res) => {
  Request.findByIdAndUpdate(req.params.id , {state : req.params.state}, function (err, docs) {
    if (err){
      console.log(err)
      res.status(500).json(err);
    }
    else{
      res.status(200).json({
        success : true
      } );
    }
});

};
