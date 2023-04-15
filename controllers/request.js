const Request = require("../models/Request");
const { errorHandler } = require("../helpers/dbErrorHandler");

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

exports.getAllRequestByUserId = async (req, res) => {
  try {
    let requests = [];
    if(req.params.role == 1){
      requests = await Request .find({userId : req.params.userId } ).populate("userId")
    }else{
      requests = await Request .find({ state :{$ne: "canceled"}} ).populate("userId")
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
