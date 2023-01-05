const { saveInputs } = require('../routes/inputs');
const { saveOutputs } = require('../routes/outputs');

function input1(payload){
    let bin = dec2bin16(payload)    
    let obj = {
      M1Error : parseInt(bin[0]),
      M2Error : parseInt(bin[1]),
      M3Error : parseInt(bin[2]),
      Water_on : parseInt(bin[3]),
      Start : parseInt(bin[4]),
      Stop : parseInt(bin[5]),
      F1Error : parseInt(bin[6]),
      F2Error : parseInt(bin[7]),
      F3Error : parseInt(bin[8]),
      Auto : parseInt(bin[9]),

    }
    let inputChanged = false;
    inputs.forEach(extra=>{
        if(Object.keys(obj).includes(extra.name)){
            if(extra.is_on != obj[extra.name]){
                extra.is_on = obj[extra.name];
                console.log(`Extra ${extra.name} changed to ${extra.is_on}`);
                inputChanged = true;
            }
        }
    })
    if(inputChanged && saveInputs){
        saveInputs(inputs);
    }
    calculateOutput()
}


function initInputs(initData){
    inputs = initData
    console.log('inputs', inputs.length);
}

function initOutputs(initData){
    outputs = initData
    console.log('outputs', outputs.length);
}


let inputs = []
let outputs = []

let wsOutput;

function calculateOutput(){
    // FINAL
    let output1 = `0000000001`;
    output1 = output1.split("").reverse().join("");
    wsOutput.output1({num: parseInt(output1, 2)})

    saveOutputs(outputs);
}
setTimeout(()=>{
    wsOutput = require('../communication/webSockets');
},10)

module.exports = {
    initInputs,
    initOutputs,
    input1,
}

function dec2bin16(dec) {
    let bin = (dec >>> 0).toString(2);
    while(bin.length!=16){
        bin = "0" + bin;
    }
    return bin
}
function reverse(s){
    return s.split("").reverse().join("");
}