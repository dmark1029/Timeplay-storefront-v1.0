import React, { useState, useEffect, useRef, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';

type Point = {
  x: number;
  y: number;
};

type CustomBrush = {
  image: string; // Changed any to string for image source
  width: number;
  height: number;
};

type CustomCheckZone = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface Props {
  width: number;
  height: number;
  image: string; // Changed any to string for image source
  finishPercent?: number;
  onComplete?: () => void;
  getMousePosition?: (x: any, y: any) => any
  brushSize?: number;
  children?: React.ReactNode; // Changed any to React.ReactNode
  customBrush?: CustomBrush;
  customCheckZone?: CustomCheckZone;
  scratching?: boolean; 
  scale?: number;
  colors?: string[];
  particleWidth?: any;
}

const Scratch: React.FC<Props> = ({
  width,
  height,
  image,
  finishPercent = 70,
  onComplete,
  getMousePosition,
  brushSize = 20,
  children,
  customBrush,
  customCheckZone,
  scratching,
  scale,
  colors = [],
  particleWidth
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const isDrawing = useRef<boolean>(false);
  const lastPoint = useRef<Point | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // Removed union type with null
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const brushImage = useRef<HTMLImageElement | null>(null); // Changed any to HTMLImageElement
  const [posx, setPosX] = useState<number>(0);
  const [posy, setPosY] = useState<number>(0);
  const particleRef = useRef<HTMLCanvasElement | null>(null);
  let animationFrameId: number;
  let particles: any = [];

  useEffect(() => {
    const canvas = particleRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Failed to get 2D context for canvas");
      return;
    }
    canvas.width = particleWidth;
    canvas.height = 240;

    const createParticle = () => {
      const x = Math.random() * canvas.width;
      const y = 0;
      const radius = 1.4;
      const speed = Math.random() * 5 + 1;
      const particleColors = colors || []
      const randomIndex = Math.floor(Math.random() * particleColors.length);
      const color = particleColors[randomIndex];
      particles.push({ x, y, radius, speed, color });
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle: any, index: any) => {
        particle.y += particle.speed;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        if (particle.y > canvas.height) {
          particles.splice(index, 1);
        }
      });

      if (Math.random() < 0.9) {
        createParticle();
      }
    };

    if (scratching) {
      animate();
    }
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [scratching]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctx.current = canvas.getContext('2d');
    if (!ctx.current) return;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      ctx.current?.drawImage(img, 0, 0, width, height);
      setLoaded(true);
    };
    img.src = image;

    if (customBrush) {
      brushImage.current = new Image();
      brushImage.current.src = customBrush.image;
    }
  }, [image, width, height, customBrush]);

  const handlePercentage = (filledInPixels: number) => {
    if (finished) return;

    if (filledInPixels > finishPercent) {
      const canvasElement = canvasRef.current;
      if (canvasElement) {
        const canvasStyle = canvasElement.style;
        canvasStyle.transition = '1s';
        canvasStyle.opacity = '0';
      }
      setFinished(true);
      if (onComplete) onComplete();
    }
  };

  const getMouse = (e: ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.pageX;
        clientY = e.pageY;
    }

    const x = clientX - rect.left - scrollLeft;
    const y = clientY - rect.top - scrollTop;
    if (getMousePosition) {
      getMousePosition(x, y);
      setPosX(x)
      setPosY(y)
    }
    return { x, y };
  };

  const handleMouseDown = (e: ReactTouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    lastPoint.current = getMouse(e, canvasRef.current!);
  };
  const handleMouseMove = (e: ReactTouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const currentPoint = getMouse(e, canvasRef.current!);
    const distance = distanceBetween(lastPoint.current!, currentPoint);
    const angle = angleBetween(lastPoint.current!, currentPoint);

    for (let i = 0; i < distance; i++) {
      const x = lastPoint.current!.x + Math.sin(angle) * i;
      const y = lastPoint.current!.y + Math.cos(angle) * i;
      if (ctx.current) {
        ctx.current.globalCompositeOperation = 'destination-out';
      }

      ctx.current?.beginPath();
      scale === 1 ? ctx.current?.arc(x, y, brushSize, 0, 2 * Math.PI, false) : ctx.current?.arc(x * 1.25, y * 1.25, brushSize, 0, 2 * Math.PI, false);
      ctx.current?.fill();
    }

    lastPoint.current = currentPoint;
    handlePercentage(getFilledInPixels(32));
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const distanceBetween = (point1: Point, point2: Point) => {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  };

  const angleBetween = (point1: Point, point2: Point) => {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
  };

  const getFilledInPixels = (stride: number) => {
    if (!stride || stride < 1) {
      stride = 1;
    }

    let x = 0;
    let y = 0;
    let width = canvasRef.current!.width;
    let height = canvasRef.current!.height;
    
    if (customCheckZone) {
      x = customCheckZone.x;
      y = customCheckZone.y;
      width = customCheckZone.width;
      height = customCheckZone.height;
    }

    const pixels = ctx.current!.getImageData(x, y, width, height);
    const total = pixels.data.length / stride;
    let count = 0;

    for (let i = 0; i < pixels.data.length; i += stride) {
      if (parseInt(pixels.data[i].toString(), 10) === 0) { // Changed parseInt to convert to string first
        count++;
      }
    }
    return Math.round((count / total) * 100);
  };

  const containerStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    position: 'relative',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    userSelect: 'none'
  };

  const canvasStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    transform: `scale(${scale === 1 ? 1 : 0.75})`,
    marginTop: `${scale === 1 ? '0px' : '5px'}`
  };

  const resultStyle: React.CSSProperties = {
    visibility: loaded ? 'visible' : 'hidden',
    width: '100%',
    height: '100%'
  };

  return (
    <div className='ScratchCard__Container' style={containerStyle}>
      <canvas
        ref={canvasRef}
        className='ScratchCard__Canvas'
        style={canvasStyle}
        width={width}
        height={height}
        onTouchStart={(e) => handleMouseDown(e)}
        onTouchMove={(e) => handleMouseMove(e)}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
      />
      <div className='ScratchCard__Result' style={resultStyle}>
        {children}
        <canvas
          ref={particleRef} className={`bg-transparent z-50 absolute top-8 ${!isDrawing.current ? 'hidden' : ''}`}
          style={{
            top: `${posy / 16}rem`,
            left: `${scale === 1 
              ? particleWidth === 35 
                ? (posx - 20) / 16 
                : (posx - 10) / 16 
              : posx / 16}rem`,
          }}
        />
      </div>
    </div>
  );
};

export default Scratch;
