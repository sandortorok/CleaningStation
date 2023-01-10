var express = require('express');
app = express();

const server = module.exports = require('http').createServer(app);

require('./communication/webSockets');
var modbus = require('./communication/modbus');
var inputs = require('./routes/inputs').router;
var outputs = require('./routes/outputs').router;
var errorMessages = require('./routes/errorMessages').router;

var auth = require('./routes/auth');

const cors = require("cors")
app.use(cors());
app.use(express.json())

const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/modbus', modbus);
app.use('/inputs', inputs);
app.use('/outputs', outputs);
app.use('/errorMessages', errorMessages);

app.use('/auth', auth);

server.listen(port, () => {
    console.log('\x1b[36m%s\x1b[0m', `App Running on http://localhost:${port}`, '🥦 🥦 🥦')
})