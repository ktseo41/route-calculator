import React from "react";
import styled from "styled-components";

const NotiMessageBody = styled.div`
  border: none;
  padding: 0.75em 1em;
`;

const BugReport = styled.div`
  text-align: center;
`;

export const NotiTitle = () => {
  return (
    <div className="is-size-6">
      일랜시아 웹 루트 계산기입니다.{" "}
      <span className="is-size-7"> - 버전 0.9.4</span>
    </div>
  );
};

export const NotiMessage = () => {
  return (
    <NotiMessageBody className="message-body has-text-left has-text-weight-normal">
      <span className="has-text-weight-semibold">추가 예정 기능</span>
      <br /> <br />
      <span>1. 저장, 불러오기 기능 (진행중)</span>
      <br />
      2. 이미지로 내보내기
      <br />
      3. 노드 순서 변경
      <br /> <br />
      <span className="has-text-weight-semibold">현재 버그들 (v0.9.4)</span>
      <br /> <br />
      <span style={{ textDecoration: "line-through" }}>
        1. 네크로멘서를 사면했을 때 인트가 5로 돌아가지 않는 문제
      </span>
      - L엠일님 제보
      <br />
      <span style={{ textDecoration: "line-through" }}>
        2. 같은 직업 이전 노드의 잡포인트가 제대로 반영되지 않던 문제
      </span>
      - L아리냥님 제보
      <hr />
      버그를 발견하셨나요? 아래 카페 게시글에 댓글로 달아주세요!
      <br /> <br />
      <BugReport>
        <a href="https://cafe.naver.com/elan77/486246">게시글 링크</a>
      </BugReport>
    </NotiMessageBody>
  );
};
