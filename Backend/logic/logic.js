const { saveInputs, getDInputs } = require("../routes/inputs");
const { saveOutputs, getDOutputs } = require("../routes/outputs");
const { saveAInputs, getAInputs } = require("../routes/aInputs");
const { saveFrequencies, getFrequencies } = require("../routes/frequencies");
const { changeSpeeds } = require("./speeds");
const { addErrorMessage } = require("../routes/errorMessages");

function dInputs(payload) {
  let obj = payload["d"];
  let inputChanged = false;
  inputs.forEach((input) => {
    if (Object.keys(obj).includes(input.name)) {
      if (input.is_on != obj[input.name]) {
        if (
          [
            "F1Error",
            "F2Error",
            "F3Error",
            "M1Error",
            "M2Error",
            "M3Error",
          ].includes(input.name) &&
          obj[input.name] == 1
        ) {
          addErrorMessage(inputToErrorMessage(input.name));
        }
        input.is_on = obj[input.name];
        console.log(`Input ${input.name} changed to ${input.is_on}`);
        inputChanged = true;
      }
    }
  });
  if (inputChanged && saveInputs) {
    saveInputs(inputs);
  }
  calculateOutput();
}
function wIn(payload) {
  let newValue = payload["d"]["Bemenet"];
  aInputs.forEach((ai) => {
    if (ai.name == "wIn") {
      if (ai.value != newValue) {
        ai.value = newValue;
        saveAInputs([ai]);
      }
    }
  });
  calculateOutput();
}
function wOut(payload) {
  let newValue = payload["d"]["Kimenet"];
  aInputs.forEach((ai) => {
    if (ai.name == "wOut") {
      if (ai.value != newValue) {
        ai.value = newValue;
        saveAInputs([ai]);
      }
    }
  });
  calculateOutput();
}
function wGoal(newValue) {
  aInputs.forEach((ai) => {
    if (ai.name == "wGoal") {
      if (ai.value != newValue) {
        ai.value = newValue;
        saveAInputs([ai]);
      }
    }
  });
  calculateOutput();
}
let inputs = [];
let aInputs = [];
let outputs = [];
let frequencies = [];

getDInputs((result) => {
  inputs = JSON.parse(JSON.stringify(result));
  console.log("Digital Inputs: ", inputs.length);
});
getAInputs((result) => {
  aInputs = JSON.parse(JSON.stringify(result));
  console.log("Analog Inputs: ", aInputs.length);
});
getDOutputs((result) => {
  outputs = JSON.parse(JSON.stringify(result));
  console.log("Digital Outputs: ", outputs.length);
});
getFrequencies((result) => {
  frequencies = JSON.parse(JSON.stringify(result));
  console.log("Frequencies: ", frequencies.length);
});
let wsOutput;

function getLogicAInputs(callback) {
  callback(aInputs);
}
function getLogicDInputs(callback) {
  callback(inputs);
}
function getLogicDOutputs(callback) {
  callback(outputs);
}
function calculateOutput() {
  di = inputs.reduce((a, v) => ({ ...a, [v.name]: v.is_on }), {});
  Errors =
    di["M1Error"] ||
    di["M2Error"] ||
    di["M3Error"] ||
    di["F1Error"] ||
    di["F2Error"] ||
    di["F3Error"];
  Running = +di["Start"];
  outputs.forEach((out) => {
    if (out.name == "Errors") {
      out.is_on = Errors;
    } else if (out.name == "Running") {
      out.is_on = Running;
    } else if (
      out.name == "F1Motor" ||
      out.name == "F2Motor" ||
      out.name == "F3Motor"
    ) {
      if (!Running || Errors || di["Water_on"] || !di["Auto"]) {
        out.is_on = 0;
      }
      if (out.name === "F1Motor" && (di["F1Error"] || di["M1Error"])) {
        out.is_on = 0;
      } else if (out.name === "F2Motor" && (di["F2Error"] || di["M2Error"])) {
        out.is_on = 0;
      } else if (out.name === "F3Motor" && (di["F3Error"] || di["M3Error"])) {
        out.is_on = 0;
      }
    }
  });
  changeSpeeds(inputs, aInputs);
  dout = outputs.reduce((a, v) => ({ ...a, [v.name]: v.is_on }), {});
  // FINAL
  wsOutput.output1(dout);
  saveOutputs(outputs);
}

function inputToErrorMessage(input) {
  switch (input) {
    case "F1Error":
      return "1-es Frekvenciaváltó hiba";
    case "F2Error":
      return "2-es Frekvenciaváltó hiba";
    case "F3Error":
      return "3-as Frekvenciaváltó hiba";
    case "M1Error":
      return "1-es Motor hiba";
    case "F3Error":
      return "2-es Motor hiba";
    case "F3Error":
      return "3-as Motor hiba";
    default:
      return "Ismeretlen hiba";
  }
}
setTimeout(() => {
  wsOutput = require("../communication/webSockets");
}, 10);

module.exports = {
  dInputs,
  wIn,
  wOut,
  wGoal,
  getLogicAInputs,
  getLogicDInputs,
  getLogicDOutputs,
};
