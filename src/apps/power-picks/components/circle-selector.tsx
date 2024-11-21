import styles from './circle-selector.module.css';
import LottoBall from './lotto-ball';

interface CircleSelectorProps {
  activeNumber: number | null;
  setNumber: (number: number) => void;
  isDisabled?: boolean;
  children: JSX.Element;
  line?: (number | null)[];
  lineType?: string;
}

const CircleSelector: React.FC<CircleSelectorProps> = ({
  activeNumber,
  setNumber,
  children,
  isDisabled = false,
  line,
  lineType,
}) => {
  function isNumberSelectable(arr: (number | null)[]) {
    const count: { [key: number]: number } = {};

    // Count the frequency of each element in the array
    for (const elem of arr) {
      if (elem !== null) count[elem] = (count[elem] || 0) + 1;
    }

    const n = arr.length;

    for (const key in count) {
      if (count[key] === n - 1) {
        return parseInt(key, 10);
      }
    }

    return null;
  }

  let valueToDisable = null;
  if (line && lineType && lineType === 'combo') {
    valueToDisable = isNumberSelectable(line);
  }

  return (
    <div className='rounded-ful relative flex min-h-[20rem] min-w-full items-center justify-center'>
      {Array.from({ length: 10 }, (_, index) => {
        const disableNumber =
          valueToDisable !== null && valueToDisable === index && valueToDisable !== activeNumber;
        return (
          <button
            disabled={isDisabled || disableNumber}
            className={`${styles.PPnumber}`}
            key={index}
            onClick={() => setNumber(index)}
          >
            <LottoBall
              isDisabled={isDisabled || disableNumber}
              number={index.toString()}
              isActive={activeNumber === index}
              scale={'medium'}
            />
          </button>
        );
      })}
      {children}
    </div>
  );
};

export default CircleSelector;
