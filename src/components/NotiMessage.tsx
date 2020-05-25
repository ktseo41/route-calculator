import React from "react";
import styled from "styled-components";

type NotiMessageProps = {
  ["isNotiOn"]: boolean;
  ["setIsNotiOn"]: React.Dispatch<React.SetStateAction<boolean>>;
  ["iE11Message"]: string;
};

const DeleteNoti = styled.span`
  display: block;
  position: absolute;
  right: 11px;
`;

const NotiMessageBody = styled.div`
  border: none;
  padding: 0.75em 1em;
`;

const BugReport = styled.div`
  text-align: center;
`;

export default (notiMessageProps: NotiMessageProps) => {
  const { isNotiOn, setIsNotiOn, iE11Message } = notiMessageProps;

  return (
    <article
      style={{ position: "fixed", zIndex: 99 }}
      className={`message column is-half is-offset-one-third card ${
        isNotiOn ? "" : "is-hidden"
      }`}
    >
      <DeleteNoti
        className="delete"
        aria-label="delete"
        onClick={() => setIsNotiOn(!isNotiOn)}
      ></DeleteNoti>

      {iE11Message || (
        <NotiMessageBody className="message-body has-text-left has-text-weight-normal">
          웹 일랜시아 루트 계산기입니다.{" "}
          <span className="is-size-7"> - 버전 0.9.3</span> <br /> <br />
          <span className="has-text-weight-semibold">
            * 타이틀을 누르면 reset 됩니다.
          </span>{" "}
          <br /> <br />
          추가 예정 기능
          <br /> <br />
          1. 기존 직업 포인트, 스탯 입력 기능
          <br />
          2. 이미지로 내보내기
          <br />
          3. 노드 순서 변경
          <br /> <br />
          버그를 발견하셨나요? 아래 카페 게시글에 댓글로 달아주세요!
          <br />
          <BugReport>
            <a href="https://cafe.naver.com/elan77/486246">게시글 링크</a>
          </BugReport>
        </NotiMessageBody>
      )}
    </article>
  );
};
