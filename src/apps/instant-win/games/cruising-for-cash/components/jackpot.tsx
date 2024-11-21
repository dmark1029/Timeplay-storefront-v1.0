interface JackpotProps {
    jackpot: string;
}
const Jackpot = ({ jackpot }: JackpotProps): JSX.Element => {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center text-primary-content">
            <span className="text-xl font-bold uppercase">your chance to win</span>
            <span className="text-4xl font-bold uppercase text-accent">{jackpot}</span>
            <span className="text-4xl font-bold uppercase">Jackpot</span>
        </div>
    );
};

export default Jackpot;
