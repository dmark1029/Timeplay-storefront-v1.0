import { Card, CircularProgress } from '@nextui-org/react';

import { useGameContext } from '../context/game-context';
import { Line } from '../types';
import LottoBall from './lotto-ball';

interface LinesAccordionProps {
  lines: Line[];
  match_lines?: { outcome: number[]; fireball: number } | null;
  drawID?: number;
  className?: string;
}

const Lines: React.FC<LinesAccordionProps> = ({
  lines,
  match_lines = null,
  drawID,
  className = '',
}) => {
  const { calculateLineValue } = useGameContext();

  function matchCombo(line: Line, outcome: number[], fireball: number): any[] {
    const counts = new Array(10).fill(0);

    for (const n of outcome) {
      counts[n]++;
    }

    if (line.fireball_picked) counts[fireball]++;

    return line.picks.map((n) => {
      if (counts[n] === 0) {
        return { match: false, fireball: false, number: n };
      }

      return --counts[n] === 0 && n === fireball && line.fireball_picked
        ? { match: true, fireball: true, number: n }
        : { match: true, fireball: false, number: n };
    });
  }

  function matchStraight(line: Line, outcome: number[], fireball: number): any[] {
    let fireballUsed = false;
    return line.picks.map((n, i) => {
      // early return for non fireball line
      if (n !== outcome[i] && !line.fireball_picked && (fireballUsed || n !== fireball)) {
        return { match: false, fireball: false, number: n };
      }
      if (n === fireball && fireball !== outcome[i] && line.fireball_picked && !fireballUsed) {
        fireballUsed = true;
        return { match: true, fireball: true, number: n };
      } else if (n === outcome[i]) {
        return { match: true, fireball: false, number: n };
      }
      return { match: false, fireball: false, number: n };
    });
  }

  const renderPicks = (line: Line, outcome: { outcome: number[]; fireball: number } | null) => {
    if (outcome && outcome.outcome && outcome.fireball) {
      let results = [];
      if (line.line_type === 'combo')
        results = matchCombo(line, outcome!.outcome, outcome!.fireball);
      else if (line.line_type === 'straight')
        results = matchStraight(line, outcome!.outcome, outcome!.fireball);
      return results.map((result, idx) => {
        if (result)
          return (
            <LottoBall
              key={idx}
              number={result.number.toString()}
              scale='tiny'
              match={result.match}
              fireball={result.fireball}
            />
          );
      });
    }

    return line.picks.map((num, idx) => {
      return <LottoBall key={idx} number={num.toString()} scale='tiny' />;
    });
  };

  if (!lines)
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <CircularProgress aria-label='Loading...' />
      </div>
    );

  return (
    <div className='flex flex-col gap-2'>
      {lines.map((line, idx) => {
        const prizeAmount = line.prizes?.find((prize) => prize.draw_id === drawID)?.amount;

        return (
          <Card key={line.id} className={`flex gap-2 bg-white p-2 !shadow-none ${className}`}>
            <div className='flex w-full flex-row items-center justify-between'>
              <h1 className='text-pp-text-light font-tempo text-lg font-black uppercase'>
                Line {idx + 1}
              </h1>
              <h1 className='text-pp-text-dark text-medium'>
                Stake: ${line.stake} (${calculateLineValue(line)})
              </h1>
              <h1 className='text-pp-text-dark font-bold capitalize'>{line.line_type}</h1>
            </div>
            <div className='flex flex-row items-center gap-2'>
              {renderPicks(line, match_lines)}
              {line.fireball_picked && <LottoBall scale='tiny' fireball={line.fireball_picked} />}
            </div>
            {prizeAmount !== undefined && (
              <p
                className={`${
                  prizeAmount !== 0 && 'text-pp-ball-match-dark'
                } text-medium font-bold`}
              >
                Prize: ${prizeAmount}
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
};
export default Lines;
