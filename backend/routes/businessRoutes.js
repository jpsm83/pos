const express = require("express");
const router = express.Router();
const businessController = require("../controller/businessController");

router.route("/")
    .get(businessController.getBusinesses)
    .post(businessController.createNewBusiness)
    .patch(businessController.updateBusiness)
    .delete(businessController.deleteBusiness);

module.exports = router;
