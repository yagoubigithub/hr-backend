const express = require("express");
const router = express.Router();


const {create, getAllRequestsByUserId , deleteRequest  , updateRequestState , getAllRequests  , getAllRequestsToThisManager } = require("../controllers/request")
const {requireSignin} = require("../controllers/user")



router.post("/new/:userId",requireSignin, create);
router.get("/:userId/:role",requireSignin, getAllRequestsByUserId);
router.get("/approval/:userId/:role",requireSignin, getAllRequestsToThisManager);
router.get("/:userId/:role/:managerId",requireSignin, getAllRequests);
router.get("/delete/:id",requireSignin, deleteRequest);
router.put("/update/state/:id/:state",requireSignin, updateRequestState);


module.exports = router;