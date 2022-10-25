import React from 'react'


export const Close = () => {

    // count down timer to 26th
    const countDownDate = new Date("Oct 26, 2022 09:00:00").getTime();

    // Update the count down every 1 second
    const x = setInterval(function() {
        // Get today's date and time
        const now = new Date().getTime();

        // Find the distance between now and the count down date
        const distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        document.getElementById("demo").innerHTML = days + " zile " + hours + " ore "
        + minutes + " minute " + seconds + " secunde ";

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("demo").innerHTML = "EXPIRED";
        }
    }, 1000);



    return (
        <div className='countdown'>
            <h1 id='demo'>Close</h1>
        </div>
    )
}
