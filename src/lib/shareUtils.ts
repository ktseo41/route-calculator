import { toPng } from "html-to-image";
import RouteLinkedList from "@/lib/routeLinkedList";
import { getCustomQueryFromRLL } from "@/lib/routeUtils";

/**
 * 테이블을 이미지로 변환하고 공유하는 함수
 *
 * @param rLL - RouteLinkedList 인스턴스
 * @param tableContainerSelector - 테이블 컨테이너 선택자 (기본값: ".table-container")
 * @returns Promise<void>
 *
 * @throws 테이블을 찾을 수 없거나 공유에 실패한 경우
 */
export async function shareTableAsImage(
  rLL: RouteLinkedList,
  tableContainerSelector: string = ".route-list"
): Promise<void> {
  // 테이블 요소 찾기
  const tableContainer = document.querySelector(
    tableContainerSelector
  ) as HTMLElement;

  if (!tableContainer) {
    console.error("테이블을 찾을 수 없습니다.");
    throw new Error("테이블을 찾을 수 없습니다.");
  }

  // '직업 추가' 버튼 숨기기 (캡처 시 높이 계산을 위해)
  const addButton = tableContainer.querySelector(".add-row-btn") as HTMLElement;
  const originalDisplay = addButton ? addButton.style.display : "";
  if (addButton) {
    addButton.style.display = "none";
  }

  let dataUrl = "";
  try {
    // 테이블을 이미지로 변환
    dataUrl = await toPng(tableContainer, {
      quality: 0.95,
      backgroundColor: "#131314",
      pixelRatio: 2, // 고해상도 이미지
      skipFonts: true, // CORS 문제 방지를 위해 외부 폰트 건너뛰기
    });
  } finally {
    // 버튼 스타일 복구
    if (addButton) {
      addButton.style.display = originalDisplay;
    }
  }

  // Data URL을 Blob으로 변환
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  // File 객체 생성
  const file = new File([blob], "route-table.png", { type: "image/png" });

  // 공유 URL 생성
  const queryToSave = getCustomQueryFromRLL(rLL);
  const urlToSave = `${location.origin}${location.pathname}${
    queryToSave.length === 0 ? "" : `?${queryToSave}`
  }`;

  // Web Share API 지원 확인
  if (navigator.share && navigator.canShare) {
    const shareData = {
      title: "Elan Route Calculator",
      text: "일랜시아 루트 계산 결과",
      files: [file],
    };

    // 파일 공유 지원 확인
    if (navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      // 파일 공유를 지원하지 않는 경우 URL만 공유
      await navigator.share({
        title: "Elan Route Calculator",
        text: "일랜시아 루트 계산 결과",
        url: urlToSave,
      });
    }
  } else {
    // Web Share API를 지원하지 않는 경우 클립보드에 복사
    await navigator.clipboard.writeText(urlToSave);
    alert("링크가 클립보드에 복사되었습니다!");
  }
}

/**
 * 공유 에러를 처리하는 함수
 *
 * @param error - 발생한 에러
 * @param rLL - RouteLinkedList 인스턴스 (폴백용)
 * @returns Promise<void>
 */
export async function handleShareError(
  error: any,
  rLL: RouteLinkedList
): Promise<void> {
  // 사용자가 공유 다이얼로그를 취소한 경우 (Web Share API는 AbortError 를 던짐)
  const message = String(error?.message || "").toLowerCase();
  if (
    error?.name === "AbortError" ||
    message.includes("abort") ||
    message.includes("cancell") ||
    message.includes("cancel")
  ) {
    // 취소는 정상 사용자 행동이므로 아무 메시지도 표시하지 않음
    console.debug("사용자가 공유를 취소했습니다.");
    return; // fallback 동작(클립보드 복사) 수행하지 않음
  }

  console.error("공유 중 오류가 발생했습니다:", error);

  // 실제 오류인 경우에만 폴백: URL만 클립보드에 복사
  try {
    const queryToSave = getCustomQueryFromRLL(rLL);
    const urlToSave = `${location.origin}${location.pathname}${
      queryToSave.length === 0 ? "" : `?${queryToSave}`
    }`;

    await navigator.clipboard.writeText(urlToSave);
    alert("링크가 클립보드에 복사되었습니다!");
  } catch (clipboardError) {
    console.error("클립보드 복사 실패:", clipboardError);
    alert("공유에 실패했습니다. 브라우저가 해당 기능을 지원하지 않습니다.");
  }
}
