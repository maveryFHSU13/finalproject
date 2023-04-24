const State = require("../model/State");
const stateData = {
  state: require("../model/statesData.json"),
  setStates: function (stateData) {
    this.state = stateData;
  },
};
/*
  GET requests
*/
//get all states and return it
const getAllStates = async (req, res) => {
  const { contig } = req.query;

  if (contig === "false") {
    return res.json(
      stateData.state.filter((st) => st.code === "AK" || st.code === "HI")
    );
  }
  if (contig === "true") {
    return res.json(
      stateData.state.filter((st) => st.code != "AK" && st.code != "HI")
    );
  }
  //get from external db or mongoose
  const funStates = await State.find();

  //loop and make state array with funfacts
  let allStates = stateData.state;
  allStates.forEach((state) => {
    const funStateExists = funStates.find((st) => st.stateCode == state.code);
    if (funStateExists) {
      let funArray = funStateExists.funfacts;
      if (funArray.length != 0) {
        state.funfacts = [...funArray];
      }
    }
  });

  res.json(allStates);
};

const getState = async (req, res) => {
  //find state from url
  const singleState = stateData.state.find(
    (state) => state.code === req.params.state.toUpperCase()
  );

  //get from external db or mongoose
  const funSingleState = await State.find();

  //find all or any funfacts
  const funStateExists = funSingleState.find(
    (st) => st.stateCode === singleState.code
  );

  if (funStateExists) {
    let funArray = funStateExists.funfacts;
    //more than one fact
    if (funArray.length != 0) {
      singleState.funfacts = [...funArray];
    }
  }
  /*  find single state before funfacts
  if (!singleState) {
    console.log("no states");
    return res
      .status(404)
      .json({ message: "Invalid state abbreviation parameter" });
  }
  */
  res.json(singleState);
};

const getStateFunFact = async (req, res) => {
  const singleState = stateData.state.find(
    (state) => state.code === req.params.state.toUpperCase()
  );

  const funSingleState = await State.find();

  //find all or any funfacts
  const funStateExists = funSingleState.find(
    (st) => st.stateCode == singleState.code
  );

  if (funStateExists) {
    let funArray = funStateExists.funfacts;

    console.log(funArray);

    let randomNum = Math.floor(Math.random() * funArray.length);

    let funfact = funArray[randomNum];

    res.json({ funfact });
  }
  if (!funStateExists) {
    return res.json({
      message: `No Fun Facts found for ${singleState.state}`,
    });
  }
};

const getStateCapital = (req, res) => {
  const singleState = stateData.state.find(
    (state) => state.code === req.params.state.toUpperCase()
  );

  //State name and capital nam
  const state = singleState.state;
  const capital = singleState.capital_city;

  //return the respons
  res.json({ state, capital });
};
const getStateNickname = (req, res) => {
  const singleState = stateData.state.find(
    (state) => state.code === req.params.state.toUpperCase()
  );

  //State name and capital nam
  const state = singleState.state;
  const nickname = singleState.nickname;

  //return the respons
  res.json({ state, nickname });
};
const getStatePopulation = (req, res) => {
  const singleState = stateData.state.find(
    (state) => state.code === req.params.state.toUpperCase()
  );

  //State name and capital nam
  const state = singleState.state;
  const num = singleState.population;
  const population = num.toLocaleString("en-US");

  //return the respons
  res.json({ state, population });
};
const getStateAdmission = (req, res) => {
  const singleState = stateData.state.find(
    (state) => state.code === req.params.state.toUpperCase()
  );

  //State name and capital nam
  const state = singleState.state;
  const admitted = singleState.admission_date;

  //return the respons
  res.json({ state, admitted });
};

/*
  PUT Request
*/
const createStateFunFacts = async (req, res) => {
  //make sure funfacts are in the body
  if (!req?.body?.funfacts) {
    return res.status(400).json({ message: "State fun facts value required" });
  }

  //get the state code and funfacts
  const stateCode = req.params.state.toUpperCase();
  const funfacts = req.body.funfacts;

  //make sure funfacts are in an array
  if (!(funfacts instanceof Array) || funfacts instanceof String) {
    return res
      .status(400)
      .json({ message: "State fun facts value must be an array" });
  }

  //search mongodb for state
  console.log(stateCode);
  const findState = await State.findOne({ stateCode: stateCode }).exec();
  console.log(findState);

  //if there are no entries creat a new one
  if (!findState) {
    try {
      const result = await State.create({
        stateCode: stateCode,
        funfacts: funfacts,
      });

      res.status(201).json(result);
    } catch (error) {
      console.error(error);
    }
  } else {
    // exising entries array add to them
    let funArray = findState.funfacts;
    funArray = funArray.push(...funfacts);
    const result = await findState.save();
    res.status(201).json(result);
  }
};

/*
  Patch Request
*/

const updateStateFunFact = async (req, res) => {
  //make sure index is included

  if (!req.body.index) {
    return res
      .status(400)
      .json({ message: "State fun fact index value required" });
  }
  //make sure funfact body is included

  if (!req?.body.funfact) {
    return res.status(400).json({ message: "State fun fact value required" });
  }

  //get the state, code, and funfacts
  const singleState = stateData.state.find(
    (state) => state.code === req.params.state.toUpperCase()
  );

  const stateCode = req.params.state.toUpperCase();

  const findState = await State.findOne({ stateCode: stateCode }).exec();

  if (!findState) {
    return res.json({
      message: `No Fun Facts found for ${singleState.state}`,
    });
  }

  if (findState.funfacts) {
    if (findState.funfacts.length >= req.body.index) {
      findState.funfacts[req.body.index - 1] = req.body.funfact;
    } else {
      return res.status(404).json({
        message: `No Fun Fact found at that index for ${singleState.state}`,
      });
    }
  }

  //save and wait
  const result = await findState.save();
  res.status(201).json(result);
};

/*
DELETE REQUEST
*/

const deleteStateFunFact = async (req, res) => {
  //if index is not in body
  if (!req?.body.index) {
    return res
      .status(400)
      .json({ message: "State fun fact index value required" });
  }
  const singleState = stateData.state.find(
    (state) => state.code === req.params.state.toUpperCase()
  );

  const stateCode = req.params.state.toUpperCase();
  const index = req.body.index - 1;

  const findState = await State.findOne({
    stateCode: stateCode,
  }).exec();

  if (!findState) {
    return res.json({
      message: `No Fun Facts found for ${singleState.state}`,
    });
  }

  if (findState.funfacts) {
    if (findState.funfacts.length >= req.body.index) {
      findState.funfacts.splice(index, 1);
    } else {
      return res.status(404).json({
        message: `No Fun Fact found at that index for ${singleState.state}`,
      });
    }
  }

  const result = await findState.save();
  res.json(result);
};

//exports all values
module.exports = {
  getAllStates,
  getState,
  getStateFunFact,
  getStateCapital,
  getStateNickname,
  getStatePopulation,
  getStateAdmission,
  createStateFunFacts,
  updateStateFunFact,
  deleteStateFunFact,
};
