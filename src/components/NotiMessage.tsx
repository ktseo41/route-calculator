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

export const NotiMessage = (queryToSave: string) => {
  return (
    <NotiMessageBody className="message-body has-text-left has-text-weight-normal">
      <span className="has-text-weight-semibold">루트 계산기를 새롭게 업데이트했습니다.</span>
      <br /> <br />
      <span>1. <a href={`v2/?${queryToSave}`}>v2</a> 링크를 눌러 이동 가능합니다.</span>
      <br />
      2. 구 루트 계산기 (v1)도 계속 유지할 예정입니다.
      <br />
      3. 버그, 문의, 개선 요청사항 창구도 새롭게 만들었습니다. (링크: <a href="https://tally.so/r/0QdJB9">https://tally.so/r/0QdJB9</a>)
      <br /> <br />
      <span className="has-text-weight-semibold">추가 예정 기능</span>
      <br /> <br />
      <span style={{ textDecoration: "line-through" }}>1. 저장, 불러오기 기능</span><span> v2에서 구현 완료 </span>
      <br />
      <span style={{ textDecoration: "line-through" }}>2. 이미지로 내보내기</span><span> v2에서 구현 완료 </span>
      <br />
      <span style={{ textDecoration: "line-through" }}>3. 노드 순서 변경</span><span> v2에서 구현 완료 </span>
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
