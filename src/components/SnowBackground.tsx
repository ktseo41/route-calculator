import { useEffect, useState } from "react";

const SNOWFLAKE_COUNT = 50;

export default function SnowBackground({
  className = "",
}: {
  className?: string;
}) {
  const [flakes, setFlakes] = useState<
    Array<{ id: number; style: React.CSSProperties }>
  >([]);

  useEffect(() => {
    const newFlakes = Array.from({ length: SNOWFLAKE_COUNT }).map((_, i) => {
      const size = Math.random() * 4 + 2; // 2px to 6px
      const duration = Math.random() * 10 + 10; // 10s to 20s
      const delay = Math.random() * 10; // 0s to 10s
      const left = Math.random() * 100; // 0% to 100%

      return {
        id: i,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `-${delay}s`, // Negative delay to start mid-animation
          opacity: Math.random() * 0.5 + 0.3,
        },
      };
    });
    setFlakes(newFlakes);
  }, []);

  return (
    <div className={`snow-container ${className}`} aria-hidden="true">
      {flakes.map((flake) => (
        <div key={flake.id} className="snowflake" style={flake.style} />
      ))}
    </div>
  );
}
