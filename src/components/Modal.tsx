import React from "react";
import styled from "styled-components";

type ModalProps = {
  ["isActive"]: boolean;
  ["setIsActive"]: React.Dispatch<React.SetStateAction<boolean>>;
};

export default ({ isActive, setIsActive }: ModalProps) => {
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
            <p className="card-header-title">modal example</p>
            <button
              className="modal-close is-large"
              aria-label="close"
              onClick={() => {
                setIsActive(false);
              }}
            ></button>
          </header>
          <div className="card-content">content here</div>
        </div>
      </div>
    </div>
  );
};
