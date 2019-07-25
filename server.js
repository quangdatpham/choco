const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const orderNumbers = [
    { no: 0 },
    { no: 0 },
    { no: 0 }
];

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const OrderStatus = {
    DONE: 1,
    PROCESSING: 2,
    DELIVERED: 3
};

app.get('/order-numbers', (req, res) => {
    res.send(orderNumbers);
});

app.post('/order-numbers', (req, res) => {
    const { no } = req.body;
    
    if ( !no) return;

    // orderNumber.status = OrderStatus.PROCESSING;
    
    console.log('post orderNumber', no);

    orderNumbers.unshift({ no });
    orderNumbers.pop();

    io.emit('order', orderNumbers);
    res.sendStatus(200);
});

app.patch('/order-numbers/:id', (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    // update
});

io.on('connection', () => {
    console.log('A user is connected');
})

const server = http.listen(3000, () => {
    console.log(`Server is now running on port ${server.address().port}`);
});