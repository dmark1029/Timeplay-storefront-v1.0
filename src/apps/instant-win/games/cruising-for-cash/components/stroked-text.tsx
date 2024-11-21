import { cn } from '@/utils/cn';

type StrokedTextProps = {
  text: string;
  className?: string;
  isActive?: boolean;
  strokeWidth?: number;
  [key: string]: any;
};

const StrokedText: React.FC<StrokedTextProps> = ({
  text,
  className = '',
  isActive = false,
  strokeWidth = 0.5,
  ...props
}) => {
  const activeTextStyle = {
    fontWeight: 'bold',
    color: 'black',
    WebkitTextStroke: `${strokeWidth}px white`, // Stroke width and color for WebKit browsers
    textShadow: `
      -${strokeWidth}px -${strokeWidth}px 0 white,
       ${strokeWidth}px -${strokeWidth}px 0 white,
      -${strokeWidth}px  ${strokeWidth}px 0 white,
       ${strokeWidth}px  ${strokeWidth}px 0 white
    `, // Shadow fallback for other browsers
  };

  const inActiveTextStyle = {
    fontWeight: 'bold',
    color: 'white',
    fontStretch: 'ultra-condensed',
    WebkitTextStroke: `${strokeWidth}px black`, // Stroke width and color for WebKit browsers
    textShadow: `
      -${strokeWidth}px -${strokeWidth}px 0 #000,
       ${strokeWidth}px -${strokeWidth}px 0 #000,
      -${strokeWidth}px  ${strokeWidth}px 0 #000,
       ${strokeWidth}px  ${strokeWidth}px 0 #000
    `, // Shadow fallback for other browsers
  };

  return (
    <p
      style={isActive ? activeTextStyle : inActiveTextStyle}
      className={cn('font-tempo', className)}
      {...props}
    >
      {text}
    </p>
  );
};
export default StrokedText;
