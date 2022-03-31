
interface CountdownProps {
    minutes: string | number;
    seconds: string | number;
}

const Countdown = ({ minutes, seconds }: CountdownProps) => {
    return (
        <div className="countdown">
            <p className="minutes">{minutes}:</p>
            <p className="seconds">{seconds}</p>
        </div>
    );
}

export default Countdown;