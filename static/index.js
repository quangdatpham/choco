function sendOrderNumber(orderNumber) {
    fetch('/order-numbers', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            no: parseInt(orderNumber.no),
            status: orderNumber.status,
            time: orderNumber.time
        })
    })
    .then(() => {
        console.log('ok');
    })
    .catch(err => {
        console.log(err);
    });
}

// time format 00:00
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