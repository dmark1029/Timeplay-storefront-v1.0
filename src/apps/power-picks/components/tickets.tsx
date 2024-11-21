import { useEffect, useState } from 'react';

import { Accordion, AccordionItem, CircularProgress } from '@nextui-org/react';

import { useGameContext } from '../context/game-context';
import { Ticket } from '../types';
import Lines from './lines';

interface ClassNames {
  lines: string;
}

interface TicketsAccordionProps {
  drawID: number;
  match_lines?: { outcome: number[]; fireball: number } | null;
  useContext?: boolean;
  className?: string;
  classNames?: ClassNames;
}

const Tickets: React.FC<TicketsAccordionProps> = ({
  drawID,
  match_lines = null,
  className = '',
  classNames = { lines: '' },
  useContext = false,
}) => {
  const [tickets, setTickets] = useState<Ticket[]>();
  const { getUserTickets, calculateTicketValue, setLiveDrawTickets } = useGameContext();

  useEffect(() => {
    getUserTickets(drawID).then((data: Ticket[]) => {
      setTimeout(() => {
        setTickets(data);
      }, 300);
      if (useContext) setLiveDrawTickets(data);
    });
  }, []);

  if (!tickets) {
    return (
      <div className='flex items-center justify-center'>
        <CircularProgress aria-label='Loading...' />
      </div>
    );
  } else if (tickets.length === 0) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <p className='text-medium text-slate-600'>You have no tickets for this draw.</p>
      </div>
    );
  }

  return (
    <Accordion variant='splitted' className='!p-0'>
      {tickets.map((ticket: any) => (
        <AccordionItem
          key={ticket.id}
          title={<p className='font-tempo'>{`Ticket #${ticket.id}`}</p>}
          textValue={`Ticket #${ticket.id}`}
          subtitle={`Total stake: $${calculateTicketValue(ticket.lines)}`}
          className={`!shadow-none ${className}`}
        >
          <Lines
            match_lines={match_lines}
            lines={ticket.lines}
            className={classNames.lines}
            drawID={drawID}
          ></Lines>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
export default Tickets;
