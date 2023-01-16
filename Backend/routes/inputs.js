
const express = require("express");
router = express.Router();
var db = require('./connectMysql');

function getDInputs(callback){
    let sql = `SELECT * FROM input`

    db.query(sql, function(err, results){
          if (err) throw err
          return callback(results);
  })
}

router.get('/', (req, res) =>{
    let sql = `SELECT * FROM input`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.get('/wateron', (req, res) =>{
    let sql = `SELECT * FROM input where name = 'Water_on'`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.get('/auto', (req, res) =>{
    let sql = `SELECT * FROM input where name = 'Auto'`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

function saveInputs(inputs){
    inputs.forEach(el => {
        let sql = `UPDATE input SET is_on = ${el.is_on} WHERE name = '${el.name}'`
        db.query(sql, (err, result) => {
            if(err) throw err;
        })
    });
}

module.exports = {router, saveInputs, getDInputs};