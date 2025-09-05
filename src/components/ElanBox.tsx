import React from 'react';

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
// 주의: 폰트는 기존과 동일하게 'VT323'을 사용하므로 프로젝트의
// index.html <head>에 폰트 링크를 추가하세요.
// <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
// --------------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  width?: string; // Optional fixed width (e.g. '280px')
  height?: string; // Optional fixed height (e.g. '450px')
  className?: string; // Additional Tailwind classes for flexibility
  title?: string; // Optional title displayed at top-left corner
};

/**
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to be wrapped inside the frame
 * @param {string} [props.width] - Optional fixed width (e.g. '280px')
 * @param {string} [props.height] - Optional fixed height (e.g. '450px')
 * @param {string} [props.className] - Additional Tailwind classes for flexibility
 * @param {string} [props.title] - Optional title displayed at top-left corner
 * @returns 
 */
const GameWindowFrameTW: React.FC<Props> = ({ children, width, height, className = '', title }) => {
  // Use inline styles only if width/height are explicitly provided
  // Otherwise, let Tailwind classes handle sizing for flexibility
  const sizeStyle: React.CSSProperties = {
    fontFamily: "'VT323', monospace",
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div
      className={`bg-black p-[3px] box-border relative ${className}`}
      style={{ ...sizeStyle, boxShadow: '0 0 15px rgba(0,0,0,0.5)' }}
    >
      {title && (
        <div
          className="absolute -top-1 left-2 px-3 py-1 text-white text-sm font-bold z-10"
          style={{
            fontFamily: "'VT323', monospace",
            background: 'linear-gradient(135deg, #6a6a6a 0%, #4a4a4a 50%, #2a2a2a 100%)',
            border: '2px solid',
            borderTopColor: '#8a8a8a',
            borderLeftColor: '#8a8a8a',
            borderBottomColor: '#1a1a1a',
            borderRightColor: '#1a1a1a',
            borderRadius: '3px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 1px rgba(0,0,0,0.5)',
            boxShadow: 'inset 1px 1px 1px rgba(255,255,255,0.2), inset -1px -1px 1px rgba(0,0,0,0.3)',
          }}
        >
          {title}
        </div>
      )}
      <div
        className="w-full h-full bg-black border-2 rounded-sm relative p-2 box-border"
        style={{
          borderTopColor: '#a8a8a8',
          borderLeftColor: '#a8a8a8',
          borderBottomColor: '#3f3f3f',
          borderRightColor: '#3f3f3f',
        }}
      >
        <div
          className="bg-black h-full relative box-border text-white"
          style={{
            border: '2px solid #1a1a1a',
            borderTopColor: '#5a5a5e',
            borderLeftColor: '#5a5a5e',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default GameWindowFrameTW;
