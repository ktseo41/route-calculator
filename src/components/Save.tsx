import React from "react";
import styled from "styled-components";
import CopyToClipboard from "react-copy-to-clipboard";

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

export const SaveTitle = () => {
  return (
    <div>
      저장하기{" "}
      <span className="is-size-7">
        복사된 url로 접속하면 불러올 수 있습니다.
      </span>
    </div>
  );
};

type SaveContentProps = {
  ["urlToSave"]: string;
};

export const SaveContent = ({ urlToSave }: SaveContentProps) => {
  return (
    <InputBox className="input">
      <NoLinedInput readOnly value={urlToSave} size={urlToSave.length} />
      <CopyToClipboard text={urlToSave}>
        <CopyButton>복사</CopyButton>
      </CopyToClipboard>
    </InputBox>
  );
};
