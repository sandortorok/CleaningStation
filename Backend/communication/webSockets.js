var server = require("../index");
const WebSocket = require("ws");
const { getDInputs } = require("../routes/inputs");
const { getDOutputs } = require("../routes/outputs");
const { getAInputs } = require("../routes/aInputs");
const { turnOnMotor, turnOffMotor, setFrequency } = require("./modbus");

const logicFunctions = require("../logic/logic");

const wss = new WebSocket.Server({ server: server });
const mqtt = require("mqtt");
const host = "mqtt://192.168.0.15:1883";
// const host = "mqtt://localhost:1883";

const client = mqtt.connect(host);

wss.on("connection", (ws) => {
  getDInputs((result) => {
    result = JSON.parse(JSON.stringify(result));
    ws.send(JSON.stringify({ dInputs: result }));
  });
  getDOutputs((result) => {
    result = JSON.parse(JSON.stringify(result));
    ws.send(JSON.stringify({ dOutputs: result }));
  });
  getAInputs((result) => {
    result = JSON.parse(JSON.stringify(result));
    ws.send(JSON.stringify({ aInputs: result }));
  });
  getFrequencies((result) => {
    let sendingObj = {};
    Object.values(result).forEach((freq) => {
      if (freq.id === 1) {
        sendingObj["speed1"] = freq.value;
      } else if (freq.id === 2) {
        sendingObj["speed2"] = freq.value;
      } else if (freq.id === 3) {
        sendingObj["speed3"] = freq.value;
      }
    });
    ws.send(JSON.stringify(sendingObj));
  });

  ws.on("message", (message) => {
    let parsed = JSON.parse(message);
    if (parsed && parsed.start) {
      turnOnMotor(parsed.start);
    } else if (parsed && parsed.stop) {
      turnOffMotor(parsed.stop);
    } else if (parsed && parsed.change) {
      setFrequency(parsed.change, parsed.value * 100);
    }
    if (parsed && parsed.num) {
      let topic = JSON.parse(message).topic;
      let num = JSON.parse(message).num.toString();
      client.publish(topic, num, { qos: 0, retain: false }, (error) => {
        if (error) {
          console.error(error);
        }
      });
    }
    if (parsed && parsed.goal) {
      logicFunctions.wGoal(parsed.goal);
    }
  });
});
function sendSpeeds(obj) {
  if (
    obj &&
    obj["speed1"] != undefined &&
    obj["speed2"] != undefined &&
    obj["speed3"] != undefined
  ) {
    sendMSG(JSON.stringify(obj));
  }
}
function sendMSG(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

const topic1 = "Inputs";
const topic2 = "Analog/1";
const topic3 = "Analog/2";
const topic4 = "Output/1";

client.on("connect", () => {
  console.log("Connected to MQTT");
  client.subscribe([topic1], () => {
    console.log(`Subscribe to topic "${topic1}"`);
  });
  client.subscribe([topic2], () => {
    console.log(`Subscribe to topic "${topic2}"`);
  });
  client.subscribe([topic3], () => {
    console.log(`Subscribe to topic "${topic3}"`);
  });
  client.subscribe([topic4], () => {
    console.log(`Subscribe to topic "${topic4}"`);
  });
});

const { getFrequencies } = require("../routes/frequencies");
client.on("message", (topic, payload) => {
  if (topic === topic1) {
    logicFunctions.dInputs(JSON.parse(payload.toString()));
    logicFunctions.getLogicDInputs((result) => {
      result = JSON.parse(JSON.stringify(result));
      sendMSG(JSON.stringify({ dInputs: result }));
    });
  } else if (topic === topic2) {
    logicFunctions.wIn(JSON.parse(payload.toString()));
    logicFunctions.getLogicAInputs((result) => {
      result = JSON.parse(JSON.stringify(result));
      sendMSG(JSON.stringify({ aInputs: result }));
    });
  } else if (topic === topic3) {
    logicFunctions.wOut(JSON.parse(payload.toString()));
    logicFunctions.getLogicAInputs((result) => {
      result = JSON.parse(JSON.stringify(result));
      sendMSG(JSON.stringify({ aInputs: result }));
    });
  } else if (topic === topic4) {
    logicFunctions.getLogicDOutputs((result) => {
      result = JSON.parse(JSON.stringify(result));
      sendMSG(JSON.stringify({ dOutputs: result }));
    });
  } else {
    newMsg = { topic: topic, payload: payload.toString() };
    sendMSG(JSON.stringify(newMsg));
  }
});

function output1(output) {
  output = { d: output, topic: "output1" };
  client.publish(
    "Output/1",
    JSON.stringify(output),
    { qos: 0, retain: false },
    (error) => {
      if (error) {
        console.error(error);
      }
    }
  );
}
function output2(output) {
  output = { d: output, topic: "output2" };
  client.publish(
    "Output/2",
    JSON.stringify(output),
    { qos: 0, retain: false },
    (error) => {
      if (error) {
        console.error(error);
      }
      sendMSG(JSON.stringify(newMsg));
    }
  );
}

module.exports = {
  output1,
  output2,
  sendSpeeds,
};
