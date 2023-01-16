const { saveInputs, getDInputs } = require('../routes/inputs');
const { saveOutputs, getDOutputs } = require('../routes/outputs');
const { saveAInputs, getAInputs } = require('../routes/aInputs');

function dInputs(payload){
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
    inputs.forEach(input=>{
        if(Object.keys(obj).includes(input.name)){
            if(input.is_on != obj[input.name]){
                input.is_on = obj[input.name];
                console.log(`Input ${input.name} changed to ${input.is_on}`);
                inputChanged = true;
            }
        }
    })
    if(inputChanged && saveInputs){
        saveInputs(inputs);
    }
    calculateOutput()
}
function wIn(payload){
    inputChanged = false
    aInputs.forEach(ai=>{
        if(ai.name == 'wIn'){
            if(ai.value != payload){
                inputChanged = true
                ai.value = payload
                saveAInputs([ai]);
            }
        }
    })
    calculateOutput()
}
function wOut(payload){
    aInputs.forEach(ai=>{
        if(ai.name == 'wOut'){
            if(ai.value != payload){
                ai.value = payload
                saveAInputs([ai]);
            }
        }
    })
    calculateOutput()
}
let inputs = []
let aInputs = []
let outputs = []

getDInputs(result=>{
    inputs = JSON.parse(JSON.stringify(result))
    console.log('Digital Inputs: ', inputs.length);
})
getAInputs(result=>{
    aInputs = JSON.parse(JSON.stringify(result))
    console.log('Analog Inputs: ', aInputs.length);
})
getDOutputs(result=>{
    outputs = JSON.parse(JSON.stringify(result))
    console.log('Digital Outputs: ', outputs.length);
})
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
    dInputs,
    wIn,
    wOut
}

function dec2bin16(dec) {
    let bin = (dec >>> 0).toString(2);
    if(bin.length > 16){
        return bin
    }
    while(bin.length!=16){
        bin = "0" + bin;
    }
    return bin
}

function reverse(s){
    return s.split("").reverse().join("");
}