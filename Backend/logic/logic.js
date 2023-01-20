const { saveInputs, getDInputs } = require('../routes/inputs');
const { saveOutputs, getDOutputs } = require('../routes/outputs');
const { saveAInputs, getAInputs } = require('../routes/aInputs');
const { saveFrequencies, getFrequencies } = require('../routes/frequencies');
const { getPumpOrder } = require('../routes/pumpOrder');

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
let frequencies = []
let pumpOrder = []

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
getFrequencies(result=>{
    frequencies = JSON.parse(JSON.stringify(result))
    console.log('Frequencies: ', frequencies.length);
})
getPumpOrder(result=>{
    pumpOrder = JSON.parse(JSON.stringify(result))
    console.log('PumpOrder: ', pumpOrder.length);
})
let wsOutput;



function getLogicAInputs(callback){
    callback(aInputs)
}
function getLogicDInputs(callback){
    callback(inputs)
}
function getLogicDOutputs(callback){
    callback(outputs)
}
function calculateOutput(){
    di = inputs.reduce((a, v) => ({...a, [v.name]: v.is_on}), {});
    Errors = di['M1Error'] || di['M2Error'] || di['M3Error'] || di['F1Error'] || di['F2Error'] || di['F3Error']
    Running = 0;
    if(di['Stop'] == true){
        Running = 0;
    }
    else if(di['Start']){
        Running = 1;
    }
    outputs.forEach(out=>{
        if(out.name == 'Errors'){
            out.is_on = Errors
        }
        else if(out.name == 'Running'){
            out.is_on = Running
        }
        else if(out.name == 'F1Motor' || out.name == 'F2Motor' || out.name == 'F3Motor'){
            if(!Running || Errors || di['Water_on'] || !di['Auto']){
                out.is_on = 0;
            }
        }
    })
    dout = outputs.reduce((a, v) => ({...a, [v.name]: v.is_on}), {});

    // FINAL
    let output1 = `${Running}${Errors}00${dout['F1Motor']}000${dout['F2Motor']}000${dout['F3Motor']}000`;
    wsOutput.output1({num: parseInt(output1, 2)})
    saveOutputs(outputs);
}
setTimeout(()=>{
    wsOutput = require('../communication/webSockets');
},10)

module.exports = {
    dInputs,
    wIn,
    wOut,
    getLogicAInputs,
    getLogicDInputs,
    getLogicDOutputs
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