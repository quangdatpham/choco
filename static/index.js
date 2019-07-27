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

function triggerTimer() {
    const timers = document.querySelectorAll('.timer');

    timers.forEach(timer => {
        const timerInterval = setInterval(() => {
            const timeLeft = timer.textContent.trim();

            if (timeLeft === '00:00') {
                return clearInterval(timerInterval);
            }
            
            timer.textContent = calculateNewTime(timeLeft);
        }, 1000);
    });
}

function populateOrderNumbers(orderNumbers) {
    const doneList = document.querySelector('.done-list');
    doneList.innerHTML = orderNumbers['DONE'].map(orderNumber => `
        <h2 class="col-md-3 col-xs-3"> 
            <span class="order-number-item">${orderNumber.no ? orderNumber.no : ' '}</span>
        </h2>
    `).join('');

    const preparingList = document.querySelector('.preparing-list');
    preparingList.innerHTML = orderNumbers['PREPARING'].map(orderNumber => `
        <h2 class="col-md-3 col-xs-3"> 
            <span class="order-number-item">
                ${orderNumber.no ? orderNumber.no : ' '}
                <span class="order-number-item-time ${orderNumber.no ? 'timer': ''}" data-order-number="${orderNumber.no ? orderNumber.no : ' '}">
                    ${orderNumber.no ? orderNumber.time : ' '}
                </span>
            </span>
        </h2>
    `).join('');

    triggerTimer();
}