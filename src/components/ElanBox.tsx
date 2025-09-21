import React from "react";
import { cn } from "@/lib/utils";

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

type ElanBoxComposition = {
  OuterFrame: React.FC<OuterFrameProps>;
  Border: React.FC<FrameProps>;
  ContentArea: React.FC<FrameProps>;
};

type OuterFrameProps = {
  children: React.ReactNode;
  width?: string;
  height?: string;
  className?: string;
};

type FrameProps = {
  children: React.ReactNode;
  className?: string;
};

const ElanBox: ElanBoxComposition = (() => {
  throw new Error(
    "ElanBox is a namespace and should not be rendered directly."
  );
}) as any;

const OuterFrame: React.FC<OuterFrameProps> = ({
  children,
  width,
  height,
  className = "",
}) => {
  const sizeStyle: React.CSSProperties = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div
      className={cn(
        "bg-black text-white p-[3px] box-border shadow-[0_0_15px_rgba(0,0,0,0.7)]",
        className
      )}
      style={sizeStyle}
    >
      {children}
    </div>
  );
};

const Border: React.FC<FrameProps> = ({ children, className = "" }) => (
  <div
    className={cn(
      "w-full h-full border rounded-sm box-border border-[#f7f7f7]",
      className
    )}
    style={{
      boxShadow:
        "inset 0 0 1px 1px #ffffff, inset 0 0 1px 2px rgb(74, 74, 74), 0 0 1px 0px #ffffff, 0 0 1px 2px rgb(74, 74, 74)",
    }}
  >
    {children}
  </div>
);

const ContentArea: React.FC<FrameProps> = ({ children, className = "" }) => (
  <div className={cn("h-full box-border rounded-[2px]", className)}>
    {children}
  </div>
);

ElanBox.OuterFrame = OuterFrame;
ElanBox.Border = Border;
ElanBox.ContentArea = ContentArea;

export default ElanBox;
