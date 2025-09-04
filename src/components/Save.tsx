import React from "react";
import styled from "styled-components";
import useCopyToClipboard from "../hooks/useCopyToClipboard";

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
      <span className="">
        복사된 url로 접속하면 불러올 수 있습니다.
      </span>
    </div>
  );
};

type SaveContentProps = {
  ["urlToSave"]: string;
};

export const SaveContent = ({ urlToSave }: SaveContentProps) => {
  // 커스텀 훅 사용
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const handleCopyClick = () => {
    copyToClipboard(urlToSave);
  };

  return (
    <InputBox className="input">
      <NoLinedInput readOnly value={urlToSave} size={urlToSave.length} />
      {/* CopyToClipboard 컴포넌트 대신 onClick 이벤트 핸들러를 사용 */}
      <CopyButton onClick={handleCopyClick}>
        {isCopied ? "복사됨!" : "복사"}
      </CopyButton>
    </InputBox>
  );
};
