import { cn } from '@/utils/cn';

type SvgTextProps = {
  text: string;
  className?: string;
  isActive?: boolean;
  [key: string]: any;

  backgroundImage?: string;
};

const SvgText: React.FC<SvgTextProps> = ({
  text,
  className = '',
  isActive = false,
  backgroundImage,
  ...props
}) => {
  return (
    <svg
      width='100%'
      height='100%'
      paintOrder={'stroke fill'}
      className={cn('stroke-black', 'fill-white', className)}
      xmlns='http://www.w3.org/2000/svg'
    >
      {backgroundImage && <image href={backgroundImage} width='100%' height='100%' />}
      <text x='50%' y='55%' textAnchor='middle' dominantBaseline='middle' {...props}>
        {text}
      </text>
    </svg>
  );
};
export default SvgText;
