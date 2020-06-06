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
    <div className={isActive ? "modal is-active" : "modal"}>
      <div
        className="modal-background"
        onClick={() => {
          setIsActive(false);
        }}
      ></div>
      <div className="modal-content">
        <div className="card">
          <header className="card-header">
            <div className="card-header-title">{title}</div>
            <button
              className="modal-close is-large"
              aria-label="close"
              onClick={() => {
                setIsActive(false);
              }}
            ></button>
          </header>
          <div className="card-content"> {content}</div>
        </div>
      </div>
    </div>
  );
};
