import { useEffect, useRef } from "react";

function RandomRunningDot() {
  const dotRef = useRef<HTMLSpanElement | null>(null);
  const widthRef = useRef(10);

  useEffect(() => {
    const getRandomWidth = (currentWidth: number) => {
      const min = Math.max(10, currentWidth - 10);
      const max = Math.min(50, currentWidth + 10);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const getRandomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const applyRandomStyles = () => {
      if (dotRef.current) {
        const newWidth = getRandomWidth(widthRef.current);
        const randomColor = getRandomColor();
        const randomShadow = `0 0 10px ${randomColor}`;

        widthRef.current = newWidth;
        dotRef.current.style.width = `${newWidth}px`;
        dotRef.current.style.boxShadow = randomShadow;
        dotRef.current.style.backgroundColor = randomColor;
      }
    };

    const interval = setInterval(applyRandomStyles, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="absolute left-0 bottom-0 w-full h-[1px] bg-gray-500">
      <span
        ref={dotRef}
        className="absolute left-0 h-[1px] rounded-full animate-running-dot animate-random-dot transition-all duration-300 ease-in-out"
        style={{ width: `${widthRef.current}px` }}
      ></span>
    </span>
  );
}

export default RandomRunningDot;
