const express = require("express");
router = express.Router();
var db = require("./connectMysql");

function getFrequencies(callback) {
  let sql = `SELECT * FROM frequencies ORDER BY idx`;
  db.query(sql, function (err, results) {
    if (err) throw err;
    return callback(results);
  });
}

router.get("/", (req, res) => {
  let sql = `SELECT * FROM frequencies ORDER BY idx`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.post("/order", (req, res) => {
  let msg = req.body;
  pumps = msg.pumps;
  let sql = ``;
  pumps.forEach((pump, index) => {
    sql += `UPDATE frequencies SET idx = ${index} WHERE name = '${pump.name}';`;
  });
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
router.post("/speeds", (req, res) => {
  let msg = req.body;
  pumps = msg.pumps;
  let sql = ``;
  pumps.forEach((pump) => {
    sql += `UPDATE frequencies SET value = ${pump.value} WHERE name = '${pump.name}';`;
  });
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
function saveFrequencies(frequencies) {
  frequencies.forEach((el) => {
    let sql = `UPDATE frequencies SET value = ${el.value} WHERE name = '${el.name}'`;
    db.query(sql, (err, result) => {
      if (err) throw err;
    });
  });
}
function resetFrequencies() {
  let sql = `UPDATE frequencies SET value = 0`;
  db.query(sql, (err, result) => {
    if (err) throw err;
  });
}

module.exports = { router, getFrequencies, saveFrequencies, resetFrequencies };
