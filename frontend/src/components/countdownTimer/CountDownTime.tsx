import React, { useEffect, useState } from 'react';

interface Props {
    end: Date;
}

const formatTime = (time: number) => {
    let days = Math.floor((time % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
    let hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((time % (1000 * 60)) / 1000);

    let hoursString = hours.toString();
    let minutesString = minutes.toString();
    let secondsString = seconds.toString();

    if (hours < 10) hoursString = '0' + hours;
    if (minutes < 10) minutesString = '0' + minutes;
    if (seconds < 10) secondsString = '0' + seconds;
    return days + " days " + hoursString + ':' + minutesString + ':' + secondsString;
}

const CountDownTime: React.FC<Props> = ({ end }) => {
    const difference = end.getTime()- new Date().getTime();
    const [time, setTime] = useState(difference);

    useEffect(() => {
        console.log(time);
        if(time > 0) {
            const interval = setInterval(() => {
                setTime(time => time - 1000);
            }, 1000);
    
            return () => clearInterval(interval);
        }
        setTime(0);
    }, []);
    
    return (
        <div>
            {formatTime(time)}
        </div>
    );
};

export default CountDownTime;