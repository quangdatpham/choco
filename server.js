const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const orderNumbers = {
    'DONE': Array.from({ length: 8 }, () => ({ no: 0, time: '00:00' })),
    'PREPARING': Array.from({ length: 8 }, () => ({ no: 0, time: '00:00' }))
};

function calculateNewTime(time) {
    let [ mins, secs = '00' ] = time.split(':').map(Number);

    secs--;
    if (secs < 0) {
        mins--;
        secs = 59;
    }

    secs = secs + '';
    mins = mins + '';

    return `${mins.length === 2 ? mins : '0' + mins}:${secs.length === 2 ? secs : '0' + secs}`;
}

setInterval(() => {
    orderNumbers['PREPARING'].forEach(orderNumber => {
        const timeLeft = orderNumber.time;
    
        orderNumber.time = calculateNewTime(timeLeft);

        if (orderNumber.time === '00:00') {
            orderNumbers['PREPARING'] = orderNumbers['PREPARING'].filter(preparing => preparing.no !== orderNumber.no);
            orderNumbers['DONE'].unshift({ no: orderNumber.no });
            io.emit('order', orderNumbers);
        }
    })
}, 1000);

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
    if (time === undefined || time === '' || isNaN(parseInt(time)) || time < 1) return;

    if (status === 'DONE') {
        orderNumbers['PREPARING'] = orderNumbers['PREPARING'].filter(preparing => preparing.no !== no);
    }
    
    const existing  = orderNumbers[status].find(o => o.no === no);
    if (existing) {
        existing.time = time;
    } else {
        orderNumbers[status].unshift({ 
            no: parseInt(no),
            time
        });
    }

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