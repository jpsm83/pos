const express = require("express");
const router = express.Router();
const businessController = require("../controller/businessController");

router
  .route("/")
  .get(businessController.getBusinesses)
  .post(businessController.createNewBusiness);

router
  .route("/:id")
  .get(businessController.getBusinessById)
  .patch(businessController.updateBusiness)
  .delete(businessController.deleteBusiness);

module.exports = router;
