import React, { useEffect, useState } from 'react';

interface Props {
    end: Date;
    className?: string;
    messageOnEnd?: string;
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

    if(days > 7)
    {
        return days + " days";
    }
    if(days > 0)
    {
        return days + " days " + hoursString + ':' + minutesString + ':' + secondsString;
    }
    if(hours > 0)
    {
        return hoursString + ':' + minutesString + ':' + secondsString;
    }
    if(minutes > 0)
    {
        return minutesString + ':' + secondsString;
    }
}

const CountDownTime: React.FC<Props> = ({ end, className, messageOnEnd }) => {
    const difference = end.getTime() - new Date().getTime();
    const [time, setTime] = useState(difference);

    useEffect(() => {
        if (time > 0) {
            const interval = setInterval(() => {
                setTime(time => time - 1000);
            }, 1000);

            return () => clearInterval(interval);
        }
        setTime(0);
    }, []);

    return (
      <span className={className}>
          {
              time <= 0 ? (messageOnEnd || 'Auction Ended') : formatTime(time)
          }
      </span>
    );
};

export default CountDownTime;