interface ITimerProps {
    seconds: number | null
}

const Timer = (props: ITimerProps) => {
    const { seconds } = props;

    if(!seconds) return null;

    const format = () => new Date(seconds * 1000).toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");

    return (
        <span>{ format() }</span>
    )
}

export default Timer;