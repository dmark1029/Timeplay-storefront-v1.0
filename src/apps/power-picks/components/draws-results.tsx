import React, { useCallback, useEffect, useRef, useState } from 'react';

import { CircularProgress } from '@nextui-org/react';
import axios from 'axios';

import { Draw } from '../types';
import LottoBall from './lotto-ball';

interface CompletedDrawsResponse {
  type: string;
  data: Draw[];
  page: {
    next?: string;
  };
}
interface CompletedDrawProps {
  category: string;
}
const CompletedDrawsList: React.FC<CompletedDrawProps> = ({ category }) => {
  const [data, setData] = useState<Draw[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async (nextPage: string | null = 'order=desc') => {
    setLoading(true);
    try {
      const response = await axios.get<CompletedDrawsResponse>(
        `/ships-service/ships/lottery/powerpick/draw/completed/${category}${
          nextPage ? `?${nextPage}` : ''
        }`,
      );
      setData((prevData) => [...prevData, ...response.data.data]);
      if (response.data.page) setNextPage(response.data.page.next || null);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight && !loading && nextPage) {
        fetchData(nextPage);
      }
    }
  }, [loading, nextPage, fetchData]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className='flex h-full flex-col items-center overflow-y-auto rounded-lg border p-4'
    >
      {data.map((item) => (
        <div key={item.id} className='relative flex flex-col items-center gap-2 border-b p-4'>
          <div>Draw Time: {new Date(item.draw_time).toLocaleString()}</div>
          <div className='flex flex-row gap-2'>
            {item.outcome.map((number, idx) => (
              <LottoBall key={idx} number={number?.toString()} scale='small' />
            ))}
            <LottoBall scale='small' fireball={true} number={item.fireball_outcome.toString()} />
          </div>
        </div>
      ))}
      {loading && <CircularProgress aria-label='Loading...' />}
      {!loading && data.length === 0 && <p>No draws to display.</p>}
    </div>
  );
};

export default CompletedDrawsList;
