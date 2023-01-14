
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

function addErrorMessage(message){
    var date = new Date();
    date = date.getUTCFullYear() + '-' + ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' + 
        ('00' + date.getUTCDate()).slice(-2) + ' ' + ('00' + date.getUTCHours()).slice(-2) + ':' + 
        ('00' + date.getUTCMinutes()).slice(-2) + ':' + ('00' + date.getUTCSeconds()).slice(-2);
    console.log(date);

    let sql = `INSERT INTO errorMessages (message, timestamp) values ('${message}', '${date}')`
    db.query(sql, (err, result) => {
        if(err) throw err;
    })
}
function saveInputs(inputs){
    inputs.forEach(el => {
        let sql = `UPDATE input SET is_on = ${el.is_on} WHERE name = '${el.name}'`
        db.query(sql, (err, result) => {
            if(err) throw err;
        })
    });
}

module.exports = {router};