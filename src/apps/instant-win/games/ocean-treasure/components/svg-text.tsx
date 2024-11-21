import { cn } from '@/utils/cn';

type SvgTextProps = {
  text: string;
  className?: string;
  isActive?: boolean;
  [key: string]: any;
  defaultColor?: string;
  activeColor?: string;
};

const SvgText: React.FC<SvgTextProps> = ({
  text,
  className = '',
  isActive = false,
  defaultColor = 'fill-white',
  activeColor = 'fill-yellow-400',
  ...props
}) => {
  return (
    <svg
      width='100%'
      height='100%'
      className={cn('', isActive ? { activeColor } : { defaultColor }, className)}
      xmlns='http://www.w3.org/2000/svg'
    >
      <text x='50%' y='50%' textAnchor='middle' dominantBaseline='middle' {...props}>
        {text}
      </text>
    </svg>
  );
};
export default SvgText;
