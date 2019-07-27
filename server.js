const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const orderNumbers = {
    'DONE': Array.from({ length: 8 }, () => ({ no: 0, time: 0 })),
    'PREPARING': Array.from({ length: 8 }, () => ({ no: 0, time: 0 }))
};

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/order-numbers', (req, res) => {
    res.send(orderNumbers);
});

app.post('/order-numbers', (req, res) => {
    const { no, status, time } = req.body;

    console.log('post orderNumber', req.body);

    if ( !no) return;
    if (!orderNumbers[status]) return;
    if (time === undefined || time === '') return;

    if (status === 'DONE') {
        orderNumbers['PREPARING'] = orderNumbers['PREPARING'].filter(preparing => preparing.no !== no);
        orderNumbers['PREPARING'].push({ no: 0, time: 0 });
    }
    
    orderNumbers[status].unshift({ 
        no: parseInt(no),
        time: parseInt(time)
    });
    orderNumbers[status].pop();

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