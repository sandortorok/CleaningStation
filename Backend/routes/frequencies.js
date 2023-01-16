const express = require("express");
router = express.Router();
var db = require('./connectMysql');

function getFrequencies(callback){
    let sql = `SELECT * FROM frequencies ORDER BY id`
    db.query(sql, function(err, results){
          if (err) throw err
          return callback(results);
  })
}

router.get('/', (req, res) =>{
    let sql = `SELECT * FROM frequencies ORDER BY id`
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})



module.exports = { router, getFrequencies };