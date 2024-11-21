import React from 'react';

import { cn } from '@/utils/cn';

interface TypographyProps {
  children: React.ReactNode;
  type: TypographyType;
  className?: string;
}

type TypographyType = 'h1' | 'h2' | 'h3' | 'h4' | 'p';

const Typography: React.FC<TypographyProps> = ({ children, type = 'p', className }) => {
  const styles: Record<string, string> = {
    h1: 'text-4xl text-primary font-bold',
    h2: 'text-2xl text-primary font-bold',
    h3: 'text-xl text-primary font-bold',
    h4: 'text-lg text-primary font-bold',
    p: 'text-base text-primary',
  };

  const TextTag: keyof JSX.IntrinsicElements = type;

  return <TextTag className={cn(`${styles[type]}`, className)}>{children}</TextTag>;
};

export default Typography;
