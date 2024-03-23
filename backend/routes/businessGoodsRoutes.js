const express = require('express');
const router = express.Router();
const businessGoodsController = require('../controllers/businessGoodsController');

router.route('/')
    .get(businessGoodsController.getBusinessGoods)
    .post(businessGoodsController.addBusinessGood);

router.route('/business/:id')
    .get(businessGoodsController.getBusinessGoodsByBusinessId);

router.route('/:id')
    .get(businessGoodsController.getBusinessGoodById)
    .patch(businessGoodsController.updateBusinessGood)
    .delete(businessGoodsController.deleteBusinessGood);

module.exports = router;