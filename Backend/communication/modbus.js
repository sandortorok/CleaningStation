const express = require("express");
router = express.Router();

var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();

var db = require("../routes/connectMysql");
start();
var saveInterval;

async function connect() {
  try {
    await client.connectRTUBuffered("/dev/ttyUSB0", {
      baudRate: 9600,
      dataBits: 8,
      stopBits: 1,
      parity: "none",
    });
    await client.setID(1);
    console.log("\x1b[33m%s\x1b[0m", "Connected to Modbus");
    return 0;
  } catch (err) {
    console.log(err);
    return -1;
  }
}

async function start() {
  if (saveInterval) {
    clearInterval(await saveInterval);
  }
  saveInterval = undefined;
  // open connection to a serial port
  while ((await connect()) < 0) {
    console.log("try connect");
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(5000); /// waiting 1 second.
  }
}
async function turnOnMotor(id) {
  try {
    await client.setID(id);
    await client.writeRegister(0x3200, 455).then((data) => {
      console.log("Turned on", id);
    });
  } catch (err) {
    console.log(err);
  }
}
async function turnOffMotor(id) {
  try {
    await client.setID(id);
    await client.writeRegister(0x3200, 454).then((data) => {
      console.log("Turned off", id);
    });
  } catch (err) {
    console.log(err);
  }
}
async function readCurrentFrequency(id) {
  await client.setID(id);
  await client.readHoldingRegisters(0x3305, 1).then((data) => {
    console.log(data);
  });
}
async function setFrequency(id, frequency) {
  try {
    await client.setID(id);
    await client.writeRegister(0x3201, frequency).then((data) => {
      console.log("changed", id, "to", frequency, "Hz");
    });
  } catch (err) {
    console.log(err);
  }
}
async function readRegister(id, register) {
  await client.readHoldingRegisters(register, 1).then((data) => {
    console.log(register, data);
  });
}
// setInterval(() => {
//     saveArchive('amper')
//     saveArchive('voltage')
//     saveArchive('power')
//     saveArchive('kw')
// }, 1000 * 60 * 15)

// setInterval(() => {
//     deleteOld('amper')
//     deleteOld('voltage')
//     deleteOld('power')
//     deleteOld('kw')
// }, 1000 * 60 * 60 * 12)

async function readSaveRegister(register, tableName) {
  try {
    await client.readInputRegisters(register, 2).then((kwh) => {
      binval = dec2bin16(kwh.data[0]) + dec2bin16(kwh.data[1]);
      if (register == 20548) {
        binval = dec2bin16(kwh.data[0]);
      }
      value = 0;
      if (register == 20540 || register == 20538 || register == 20548) {
        //MINUSZOSAK

        value = parseInt(binval.substring(1), 2);
        if (binval[0] == "1") {
          value *= -1;
        }
      } else {
        value = parseInt(binval, 2);
      }
      if ([20538, 20540, 20544].includes(register)) {
        value /= 100000;
      }
      if (
        [20480, 20482, 20484, 20509, 20511, 20513, 20548].includes(register)
      ) {
        value /= 1000;
      }
      if ([20592, 20594, 20598, 20600].includes(register)) {
        value /= 100;
      }
      let now = new Date();
      now = now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      let cur_date = new Date(now)
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      sql = `INSERT INTO ${tableName} (value, timestamp, type) values (${value}, '${cur_date}', ${register})`;
      db.query(sql, (err, result) => {
        if (err) throw err;
      });
      return 0;
    });
    return 0;
  } catch (err) {
    if (err.message == "Port Not Open") {
      return -1;
    }
    return -2;
  }
}

function saveArchive(tableName) {
  let now = new Date();
  let nowMinutes = now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  let cur_date = new Date(nowMinutes)
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");

  let lastMinutes = now.setMinutes(now.getMinutes() - 15);
  let last_date = new Date(lastMinutes)
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");
  sql = `
        INSERT INTO ${tableName}Archive ( value, type, timestamp )
        SELECT avg(value) as value, type, '${cur_date}'
        FROM ${tableName}Table 
        WHERE timestamp < '${cur_date}' and timestamp > '${last_date}' 
        GROUP BY type;
    `;
  db.query(sql, (err, result) => {
    if (err) throw err;
  });
  return;
}

async function deleteOld(tableName) {
  sql = `DELETE FROM ${tableName}Table WHERE timestamp - interval 1 day < NOW()`;
  db.query(sql, (err, result) => {
    console.log(result);
    if (err) throw err;
  });
}
function dec2bin16(dec) {
  let bin = (dec >>> 0).toString(2);
  while (bin.length != 16) {
    bin = "0" + bin;
  }
  return bin;
}

module.exports = {
  router,
  turnOffMotor,
  turnOnMotor,
  setFrequency,
};
