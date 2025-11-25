import { toPng } from "html-to-image";
import RouteLinkedList from "@/lib/routeLinkedList";
import { getCustomQueryFromRLL } from "@/lib/routeUtils";
import faviconV2 from "@/img/faviconV2.png";

/**
 * 테이블을 이미지 Blob으로 변환하는 함수
 *
 * @param rLL - RouteLinkedList 인스턴스
 * @param tableContainerSelector - 테이블 컨테이너 선택자 (기본값: ".route-list")
 * @returns Promise<Blob>
 */
export async function generateTableImage(
  rLL: RouteLinkedList,
  tableContainerSelector: string = ".route-list"
): Promise<Blob> {
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

  // 삭제 버튼들과 삭제 헤더 컬럼 숨기기
  const deleteButtons = tableContainer.querySelectorAll(".delete-job-btn") as NodeListOf<HTMLElement>;
  const deleteHeader = tableContainer.querySelector(".header-delete") as HTMLElement;
  const originalDeleteButtonDisplays: string[] = [];
  const originalDeleteHeaderDisplay = deleteHeader ? deleteHeader.style.display : "";
  
  deleteButtons.forEach((btn) => {
    originalDeleteButtonDisplays.push(btn.style.display);
    btn.style.display = "none";
  });
  
  if (deleteHeader) {
    deleteHeader.style.display = "none";
  }

  // 쿼리 문자열 생성
  const queryToSave = getCustomQueryFromRLL(rLL);
  
  // 푸터 요소 생성 (하단에 URL + 로고)
  const footer = document.createElement("div");
  footer.style.display = "flex";
  footer.style.justifyContent = "space-between";
  footer.style.alignItems = "center";
  footer.style.marginTop = "8px";
  footer.style.paddingTop = "8px";
  footer.style.paddingBottom = "4px";
  footer.style.paddingLeft = "8px";
  footer.style.paddingRight = "8px";
  footer.style.backgroundColor = "#27272a"; // Match table background
  footer.style.borderBottomLeftRadius = "8px";
  footer.style.borderBottomRightRadius = "8px";
  
  // 왼쪽: URL 문자열
  const urlEl = document.createElement("div");
  urlEl.innerText = queryToSave;
  urlEl.style.fontSize = "10px";
  urlEl.style.color = "rgba(255, 255, 255, 0.3)";
  urlEl.style.fontFamily = "monospace";
  urlEl.style.overflow = "hidden";
  urlEl.style.whiteSpace = "nowrap";
  urlEl.style.textOverflow = "ellipsis";
  urlEl.style.maxWidth = "60%";
  
  // 오른쪽: 로고 + 텍스트
  const signatureContainer = document.createElement("div");
  signatureContainer.style.display = "flex";
  signatureContainer.style.alignItems = "center";
  signatureContainer.style.gap = "6px";
  
  const faviconImg = document.createElement("img");
  faviconImg.src = faviconV2;
  faviconImg.style.width = "16px";
  faviconImg.style.height = "16px";
  faviconImg.style.objectFit = "contain";
  
  const signatureText = document.createElement("span");
  signatureText.innerText = "루트 계산기";
  signatureText.style.fontSize = "12px";
  signatureText.style.fontWeight = "bold";
  signatureText.style.color = "rgba(255, 255, 255, 0.5)";
  
  signatureContainer.appendChild(faviconImg);
  signatureContainer.appendChild(signatureText);
  
  footer.appendChild(urlEl);
  footer.appendChild(signatureContainer);
  
  // 백드롭 컨테이너 생성
  const backdrop = document.createElement("div");
  backdrop.style.backgroundColor = "#3f3f46"; // Zinc 700 - Backdrop color
  backdrop.style.padding = "40px";
  backdrop.style.display = "flex";
  backdrop.style.alignItems = "center";
  backdrop.style.justifyContent = "center";
  backdrop.style.width = "fit-content";
  
  // 테이블 복제 및 스타일링
  const clonedTable = tableContainer.cloneNode(true) as HTMLElement;
  clonedTable.style.backgroundColor = "#27272a"; // Zinc 800 - Table background
  clonedTable.style.borderRadius = "12px";
  clonedTable.style.boxShadow = "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"; // Shadow XL
  clonedTable.style.padding = "16px";
  clonedTable.style.width = "400px"; // Fixed width for consistency
  
  // 복제된 테이블 내부의 불필요한 요소 제거 (이미 원본에서 숨겼지만, 복제본에서도 확실히 처리)
  const clonedAddButton = clonedTable.querySelector(".add-row-btn") as HTMLElement;
  if (clonedAddButton) clonedAddButton.remove();
  
  const clonedDeleteButtons = clonedTable.querySelectorAll(".delete-job-btn");
  clonedDeleteButtons.forEach(btn => (btn as HTMLElement).remove());
  
  const clonedDeleteHeader = clonedTable.querySelector(".header-delete") as HTMLElement;
  if (clonedDeleteHeader) clonedDeleteHeader.remove();

  // 푸터 추가
  clonedTable.appendChild(footer);
  
  // 백드롭에 테이블 추가
  backdrop.appendChild(clonedTable);
  
  // 화면 밖으로 임시 추가
  document.body.appendChild(backdrop);

  let dataUrl = "";
  try {
    // 백드롭을 포함하여 이미지로 변환
    dataUrl = await toPng(backdrop, {
      quality: 0.95,
      pixelRatio: 2, // 고해상도 이미지
      skipFonts: true, // CORS 문제 방지를 위해 외부 폰트 건너뛰기
    });
  } finally {
    // 임시 요소 제거
    document.body.removeChild(backdrop);

    // 원본 테이블 복구
    if (addButton) {
      addButton.style.display = originalDisplay;
    }
    
    deleteButtons.forEach((btn, index) => {
      btn.style.display = originalDeleteButtonDisplays[index];
    });
    
    if (deleteHeader) {
      deleteHeader.style.display = originalDeleteHeaderDisplay;
    }
  }

  // Data URL을 Blob으로 변환
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  
  return blob;
}

/**
 * 이미지를 다운로드하는 함수
 */
export function downloadImage(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 이미지를 공유하는 함수 (Web Share API)
 */
export async function shareImage(
  blob: Blob, 
  filename: string
): Promise<void> {
  const file = new File([blob], filename, { type: "image/png" });
  
  if (navigator.share && navigator.canShare) {
    const shareData = {
      files: [file],
    };

    if (navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else {
      throw new Error("이미지 공유를 지원하지 않는 환경입니다.");
    }
  } else {
    throw new Error("Web Share API를 지원하지 않는 브라우저입니다.");
  }
}

/**
 * URL을 클립보드에 복사하는 함수
 */
export async function copyUrl(
  url: string
): Promise<void> {
  await navigator.clipboard.writeText(url);
}

/**
 * 이전 버전 호환성을 위한 함수 (Deprecated)
 */
export async function shareTableAsImage(
  rLL: RouteLinkedList,
  tableContainerSelector: string = ".route-list"
): Promise<void> {
  const blob = await generateTableImage(rLL, tableContainerSelector);
  const queryToSave = getCustomQueryFromRLL(rLL);
  const urlToSave = `${location.origin}${location.pathname}${
    queryToSave.length === 0 ? "" : `?${queryToSave}`
  }`;
  
  try {
    await shareImage(blob, "route-table.png");
  } catch (e) {
    // 이미지 공유 실패 시 URL 공유 시도
    await copyUrl(urlToSave);
  }
}

/**
 * 공유 에러를 처리하는 함수
 */
export async function handleShareError(
  error: any,
  rLL: RouteLinkedList
): Promise<void> {
  // 사용자가 공유 다이얼로그를 취소한 경우
  const message = String(error?.message || "").toLowerCase();
  if (
    error?.name === "AbortError" ||
    message.includes("abort") ||
    message.includes("cancell") ||
    message.includes("cancel")
  ) {
    console.debug("사용자가 공유를 취소했습니다.");
    return;
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
