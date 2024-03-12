const express = require("express");
const router = express.Router();
const posController = require("../controller/posController");

router.route("/")
    .get(posController.getPos)
    .post(posController.createNewPos);
    
router.route("/:id")
    .get(posController.getPosById)
    .patch(posController.updatePos)
    .delete(posController.deletePos);

module.exports = router;
