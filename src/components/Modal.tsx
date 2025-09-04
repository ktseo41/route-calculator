import React from "react";
import styled from "styled-components";

type ModalProps = {
  ["isActive"]: boolean;
  ["setIsActive"]: React.Dispatch<React.SetStateAction<boolean>>;
  ["title"]: JSX.Element;
  ["content"]: JSX.Element;
};

export default ({ isActive, setIsActive, title, content }: ModalProps) => {
  return (
    <div className={isActive ? "" : ""}>
      <div
        className=""
        onClick={() => {
          setIsActive(false);
        }}
      ></div>
      <div className="">
        <div className="">
          <header className="">
            <div className="">{title}</div>
            <button
              className=""
              aria-label="close"
              onClick={() => {
                setIsActive(false);
              }}
            ></button>
          </header>
          <div className=""> {content}</div>
        </div>
      </div>
    </div>
  );
};
