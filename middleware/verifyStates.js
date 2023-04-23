const statesData = require("../model/statesData.json");

const verifyStates = (req, res, next) => {
  //make sure state code is uppercase
  const states = req.params.state.toUpperCase();

  //create array of state codes
  const stateCode = statesData.map((state) => state.code);

  //compare to see if there is a match
  const matchState = stateCode.find((code) => code === states);

  //if there is not a match respond
  if (!matchState) {
    return res
      .status(400)
      .json({ message: "Invalid state abbreviation parameter" });
  }
  req.params.state = states;
  next();
};

module.exports = verifyStates;
