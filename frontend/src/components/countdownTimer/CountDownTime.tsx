import React, { useEffect, useState } from 'react';

interface Props {
  end: Date;
  className?: string;
  messageOnEnd?: string;
}

const formatTime = (time: number): string => {
  const days = Math.floor(time / (1000 * 60 * 60 * 24));
  const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time % (1000 * 60)) / 1000);

  const hoursString = hours < 10 ? `0${hours}` : `${hours}`;
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (days > 7) {
    return `${days} days`;
  } else if (days > 0) {
    return `${days} days ${hoursString}:${minutesString}:${secondsString}`;
  } else if (hours > 0) {
    return `${hoursString}:${minutesString}:${secondsString}`;
  } else if (minutes > 0) {
    return `${minutesString}:${secondsString}`;
  } else if (seconds > 0) {
    return `00:${secondsString}`;
  } else {
    window.location.reload();
  }
};

const CountDownTime: React.FC<Props> = ({ end, className, messageOnEnd }) => {
  const calculateTimeLeft = () => end.getTime() - new Date().getTime();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeLeft, end]);

  return <span className={className}>{timeLeft <= 0 ? messageOnEnd || 'Auction Ended' : formatTime(timeLeft)}</span>;
};

export default CountDownTime;
