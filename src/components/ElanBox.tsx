import React from "react";

// 사용법:
//
// 1. 고정 크기 (기존 API 호환):
// <GameWindowFrameTW width="300px" height="500px">
//   <p>고정 크기 컨텐츠</p>
// </GameWindowFrameTW>
//
// 2. 유연한 크기 (CSS Framework Card 스타일):
// <GameWindowFrameTW className="w-full max-w-md">
//   <p>반응형 컨텐츠</p>
// </GameWindowFrameTW>
//
// <GameWindowFrameTW className="w-96 h-64">
//   <p>Tailwind 크기 클래스 사용</p>
// </GameWindowFrameTW>
//
// 3. 타이틀이 있는 박스:
// <GameWindowFrameTW title="INVENTORY" className="w-80 h-64">
//   <p>인벤토리 컨텐츠</p>
// </GameWindowFrameTW>
//
// --------------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  width?: string; // Optional fixed width (e.g. '280px')
  height?: string; // Optional fixed height (e.g. '450px')
  className?: string; // Additional Tailwind classes for flexibility
  // Optional title displayed at top-left corner. Accepts plain text or any React node
  title?: React.ReactNode;
};

const GameWindowFrameTW: React.FC<Props> = ({
  children,
  width,
  height,
  className = "",
  title,
}) => {
  // Use inline styles only if width/height are explicitly provided
  // Otherwise, let Tailwind classes handle sizing for flexibility
  const sizeStyle: React.CSSProperties = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div
      className={`bg-black p-[3px] box-border ${className} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
      style={{ ...sizeStyle }}
    >
      {title ? title : null}
      <div className="w-full h-full bg-black border-2 rounded-sm p-2 box-border border-t-[#a8a8a8] border-l-[#a8a8a8] border-b-[#3f3f3f] border-r-[#3f3f3f]">
        <div className="bg-black h-full box-border text-white border-[2px] border-[#1a1a1a] border-t-[#5a5a5e] border-l-[#5a5a5e]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameWindowFrameTW;
