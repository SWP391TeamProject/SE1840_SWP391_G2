import React, { useEffect, useState } from 'react';

interface Props {
    end: Date;
}

const CountDownTime: React.FC<Props> = ({ end }) => {
    const difference = end.getTime()- new Date().getTime();
    const [time, setTime] = useState(difference);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(time => time - 1000);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return (
        <div>
            {hours}:{minutes}:{seconds}
        </div>
    );
};

export default CountDownTime;