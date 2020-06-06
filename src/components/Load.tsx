import React, { useState, useEffect } from "react";
import styled from "styled-components";

const NoLinedInput = styled.input`
  border-style: none;
`;

const InputBox = styled.div`
  display: flex;
  justify-content: space-between;
  &:focus {
    color: #363636;
    border-color: #dbdbdb;
  }

  &:hover {
    color: #363636;
    border-color: #dbdbdb;
  }
`;

const CopyButton = styled.span`
  display: inline-block;
  margin: 0px 10px;
  cursor: pointer;
  color: blue;
  justify-content: center;
  padding-bottom: calc(0.5em - 1px);
  padding-left: 1em;
  padding-right: 1em;
  padding-top: calc(0.5em - 1px);
  text-align: center;
  white-space: nowrap;

  &:active {
    background-color: #dbdbdb;
  }
`;

export const LoadTitle = () => {
  return <div>불러오기</div>;
};

export const LoadContent = () => {
  return (
    <InputBox className="input">
      <NoLinedInput autoFocus placeholder={"URL을 입력하세요"} />
      <CopyButton onClick={() => {}}>불러오기</CopyButton>
    </InputBox>
  );
};
