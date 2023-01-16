
const express = require("express");
router = express.Router();
var db = require('./connectMysql');

function getDOutputs(callback){
    let sql = `SELECT * FROM output`

    db.query(sql, function(err, results){
          if (err) throw err
          return callback(results);
  })
}

router.get('/', (req, res) =>{
    let sql = `SELECT * FROM output`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.get('/running', (req, res) =>{
    let sql = `SELECT * FROM output where name = 'Running'`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.get('/errors', (req, res) =>{
    let sql = `SELECT * FROM output where name = 'Errors'`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

function saveOutputs(outputs){
    outputs.forEach(el => {
        let sql = `UPDATE output SET is_on = ${el.is_on} WHERE name = '${el.name}'`
        db.query(sql, (err, result) => {
            if(err) throw err;
        })
    });
}

module.exports = {router, saveOutputs, getDOutputs};