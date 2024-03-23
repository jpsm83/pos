const express = require("express");
const router = express.Router();
const supplierGoodsController = require("../controller/supplierGoodsController");

router.route("/")
  .get(supplierGoodsController.getSupplierGoods)
  .post(supplierGoodsController.createNewSupplierGood);

router.get('/supplier/:id', supplierGoodsController.getSupplierGoodsBySupplierId);

router.route("/:id")
  .get(supplierGoodsController.getSupplierGoodById)
  .patch(supplierGoodsController.updateSupplierGood)
  .delete(supplierGoodsController.deleteSupplierGood);

module.exports = router;