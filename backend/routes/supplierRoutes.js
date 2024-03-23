const express = require("express");
const router = express.Router();
const supplierController = require("../controller/supplierController");

router
  .route("/")
  .get(supplierController.getSuppliers)
  .post(supplierController.createNewSupplier);

router.get('/business/:id', supplierController.getSupplierByBusinessId);

router
  .route("/:id")
  .get(supplierController.getSupplierById)
  .patch(supplierController.updateSupplier)
  .delete(supplierController.deleteSupplier);

module.exports = router;