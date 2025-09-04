import { useState } from 'react';

const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    // navigator.clipboard가 없는 환경(ex: http)을 위한 예외처리
    if (!navigator.clipboard) {
      console.error('클립보드 접근이 불가능합니다.');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      // 2초 뒤에 '복사' 버튼으로 되돌리기
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('복사에 실패했습니다.', error);
      setIsCopied(false);
      return false;
    }
  };

  return { isCopied, copyToClipboard };
};

export default useCopyToClipboard;