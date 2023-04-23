const express = require("express");
const router = express.Router();
const stateController = require("../../controllers/stateController");
const verifyStates = require("../../middleware/verifyStates");

router.route("/").get(stateController.getAllStates);

router.route("/:state").get(verifyStates, stateController.getState);

router
  .route("/:state/funfact")
  .get(verifyStates, stateController.getStateFunFact)
  .post(verifyStates, stateController.createStateFunFacts)
  .patch(verifyStates, stateController.updateStateFunFact)
  .delete(verifyStates, stateController.deleteStateFunFact);

router
  .route("/:state/capital")
  .get(verifyStates, stateController.getStateCapital);

router
  .route("/:state/nickname")
  .get(verifyStates, stateController.getStateNickname);
router
  .route("/:state/population")
  .get(verifyStates, stateController.getStatePopulation);
router
  .route("/:state/admission")
  .get(verifyStates, stateController.getStateAdmission);

module.exports = router;
