var server = require('../index')
const WebSocket = require('ws');
const { getDInputs } = require('../routes/inputs');
const { getDOutputs } = require('../routes/outputs');
const { getAInputs } = require('../routes/aInputs');

const wss = new WebSocket.Server({server:server});
const mqtt = require('mqtt');
const host = 'mqtt://localhost:1883';
const client = mqtt.connect(host);

wss.on('connection', ws => {
  getDInputs(result => {
    result = JSON.parse(JSON.stringify(result))
    ws.send(JSON.stringify({dInputs: result}))
  });
  getDOutputs(result => {
    result = JSON.parse(JSON.stringify(result))
    ws.send(JSON.stringify({dOutputs: result}))
  });
  getAInputs(result => {
    result = JSON.parse(JSON.stringify(result))
    ws.send(JSON.stringify({aInputs: result}))
  });
  ws.send(JSON.stringify({speed1: 30, speed2: 0, speed3:50}));

  ws.on('message', message=> {
    let topic = JSON.parse(message).topic;
    let num = JSON.parse(message).num.toString();

    client.publish(topic, num, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
  });
});
function sendMSG(message){
  wss.clients.forEach(client=>{
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);        
    }
  });
}
    
const topic1 = 'Input/1';
const topic2 = 'wOut';
const topic3 = 'wIn';

client.on('connect', () => {
  console.log('Connected to MQTT');
  client.subscribe([topic1], () => {
    console.log(`Subscribe to topic "${topic1}"`);
  })
  client.subscribe([topic2], () => {
    console.log(`Subscribe to topic "${topic2}"`);
  })
  client.subscribe([topic3], () => {
    console.log(`Subscribe to topic "${topic3}"`);
  })
  client.subscribe(['Output/1'], () => {
    console.log(`Subscribe to topic "Output/1"`);
  })
  client.subscribe(['Output/2'], () => {
    console.log(`Subscribe to topic "Output/2"`);
  })
})

const logicFunctions = require('../logic/logic')
client.on('message', (topic, payload) => {
  if(topic === topic1){
    logicFunctions.dInputs(parseInt(payload.toString()));
    getDInputs(result => {
      result = JSON.parse(JSON.stringify(result))
      sendMSG(JSON.stringify({dInputs: result}))
    });
  }
  else if(topic === 'wIn'){
    logicFunctions.wIn(parseFloat(payload.toString()));
    getAInputs(result => {
      result = JSON.parse(JSON.stringify(result))
      sendMSG(JSON.stringify({aInputs: result}))
    });
  }
  else if(topic === 'wOut'){
    logicFunctions.wOut(parseFloat(payload.toString()));
    getAInputs(result => {
      result = JSON.parse(JSON.stringify(result))
      sendMSG(JSON.stringify({aInputs: result}))
    });
  }
  else{
    newMsg = {topic: topic, payload:payload.toString()};
    sendMSG(JSON.stringify(newMsg));
  }
})

function output1(msg){
  let newMsg = {...msg, topic: 'output1'}
  client.publish('Output/1', JSON.stringify(newMsg), { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
    sendMSG(JSON.stringify(newMsg));
  })
}
function output2(msg){
  let newMsg = {...msg, topic: 'output2'}
  client.publish('Output/2', JSON.stringify(newMsg), { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
    sendMSG(JSON.stringify(newMsg));
  })
}

module.exports={
  output1,
  output2
}