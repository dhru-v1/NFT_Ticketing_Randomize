const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
})

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
})

let ticketCount = 0;
const maxTickets = 500;

function changeCount(change) {
    ticketCount += change;
    if (ticketCount < 0) ticketCount = 0;
    if (ticketCount > maxTickets) ticketCount = maxTickets;
    document.getElementById('ticket-count').innerText = ticketCount;
}

function payNow() {
    if (ticketCount > 0) {
        fetch('/pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ count: ticketCount })
        })
        .then(res => res.json())
        .then(data => {
            alert('Payment Complete!');
            window.location.href = '/ticket';
        });
    } else {
        alert("Please select at least one ticket.");
    }
}

// Timer logic (replace with actual event time)
function updateCountdown() {
    const eventTime = new Date('2025-04-10T18:00:00').getTime();
    const now = new Date().getTime();
    const distance = eventTime - now;

    if (distance < 0) {
        document.getElementById("time-left").innerText = "Event started!";
        return;
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("time-left").innerText = `${hours}:${minutes}:${seconds}`;
    setTimeout(updateCountdown, 1000);
}

updateCountdown();