
const express = require("express");
router = express.Router();
var db = require('./connectMysql');

let sql = `SELECT * FROM input`
db.query(sql, (err, result) => {
    if(err) throw err;
    let res = Object.values(JSON.parse(JSON.stringify(result)));
    require('../logic/logic').initInputs(res)
})


router.get('/', (req, res) =>{
    let sql = `SELECT * FROM input`
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

module.exports = {router, saveInputs};