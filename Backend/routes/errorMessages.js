
const express = require("express");
router = express.Router();
var db = require('./connectMysql');

router.get('/', (req, res) =>{
    let sql = `SELECT * FROM errorMessages order by timestamp desc`
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

module.exports = {router};