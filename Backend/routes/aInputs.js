
const express = require("express");
router = express.Router();
var db = require('./connectMysql');


function getAInputs(callback){
    let sql = `SELECT * FROM aInput`
    db.query(sql, function(err, results){
          if (err) throw err
          return callback(results);
  })
}

router.get('/', (req, res) =>{
    let sql = `SELECT * FROM aInput`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

function saveAInputs(inputs){
    inputs.forEach(el => {
        let sql = `UPDATE aInput SET value = ${el.value} WHERE name = '${el.name}'`
        db.query(sql, (err, result) => {
            if(err) throw err;
        })
    });
}

module.exports = {router, saveAInputs, getAInputs};