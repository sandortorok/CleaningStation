const {
  saveFrequencies,
  getFrequencies,
  resetFrequencies,
} = require("../routes/frequencies");

const { getAInputs } = require("../routes/aInputs");
const { getDInputs } = require("../routes/inputs");

initFrequencies();
let currentFrequencies;
let startedTime = new Date();
let lastChanged = new Date();
let lastInputs;
let lastAInputs;
const minFrequency = 25;

function changeSpeeds(inputs, aInputs) {
  let dIn = inputs.reduce((a, v) => ({ ...a, [v.name]: v.is_on }), {});
  let aIn = aInputs.reduce((a, v) => ({ ...a, [v.name]: v.value }), {});
  let increaseAmount = 0;
  if (aIn["wGoal"] - aIn["wOut"] > 0.5) {
    increaseAmount += 5;
  } else if (aIn["wGoal"] - aIn["wOut"] < -0.5) {
    increaseAmount -= 5;
  }
  if (increaseAmount < 0) {
    //HA CSÖKKENTENI KELL AKKOR FORDÍTVA MEGYÜNK VÉGIG A FREKVENCIÁKON
    currentFrequencies
      .slice()
      .reverse()
      .forEach((freq) => {
        if (freq.value === 0) {
          return;
        } else if (freq.value + increaseAmount < 25 && increaseAmount < -3) {
          //HA 25 ALÁ CSÖKKENNE ÉS 3-NÁL TÖBBET KÉNE CSÖKKENTENI
          increaseAmount = 0;
          freq.value = 0;
        } else if (freq.value + increaseAmount < 25 && increaseAmount >= -3) {
          //HA 25 ALÁ CSÖKKENNE DE 3-NÁL NEM KÉNE TÖBBET CSÖKKENTENI
          increaseAmount = 0;
        } else {
          //HA TUDJUK CSÖKKENTENI GOND NÉLKÜL
          freq.value += increaseAmount;
          increaseAmount = 0;
        }
      });
  } else if (increaseAmount > 0) {
    //HA NÖVELNI KELL A FREKVENCIÁKAT
    currentFrequencies.forEach((freq) => {
      if (freq.value === 0 && increaseAmount > 3) {
        //HA BE KELL INDÍTANI A MOTORT MINIMUM FREKVENCIÁN
        freq.value = minFrequency;
        increaseAmount = 0;
      } else if (freq.value === 50) {
        //HA MAXON VAN MÁR
        return;
      } else if (freq.value + increaseAmount > 50) {
        //HA 50 FÖLÉ MENNE AZ ÉRTÉK
        increaseAmount -= 50 - freq.value;
        freq.value = 50;
      } else {
        // HA TUDJUK NÖVELNI GOND NÉLKÜL
        freq.value += increaseAmount;
        increaseAmount = 0;
      }
    });
  }
  let speedObj = {};
  currentFrequencies.forEach((freq) => {
    if (freq.id === 1) {
      speedObj["speed1"] = freq.value;
    } else if (freq.id === 2) {
      speedObj["speed2"] = freq.value;
    } else if (freq.id === 3) {
      speedObj["speed3"] = freq.value;
    }
  });
  require("../communication/webSockets").sendSpeeds(speedObj);
}

function initFrequencies() {
  resetFrequencies();
  setTimeout(() => {
    getFrequencies((frequencies) => {
      currentFrequencies = Array.from(frequencies);
    });
    getAInputs((aInputs) => {
      lastAInputs = aInputs;
    });
    getDInputs((dInputs) => {
      lastInputs = dInputs;
    });
  }, 100);
}

module.exports = {
  changeSpeeds,
};
