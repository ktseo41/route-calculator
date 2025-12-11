## 일랜시아 루트 계산기 v2.0.0

<p align="center">
  <img src="https://i.imgur.com/6RMIBsI.gif" alt="description">
</p>

### :joystick: 넥슨 고전게임 일랜시아의 직업포인트에 따른 스탯 계산기입니다.

### :sparkles: v2.0 업데이트 기능

- <img src="https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/arrows-out-line-vertical.svg" width="16" height="16" style="vertical-align: middle;"> **드래그로 순서 변경**: 직업 순서를 드래그 앤 드롭으로 손쉽게 변경할 수 있습니다.
- <img src="https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/chart-line-up.svg" width="16" height="16" style="vertical-align: middle;"> **누적 보기 모드**: 스탯의 변화를 누적 수치로 한눈에 확인할 수 있습니다.
- <img src="https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/image.svg" width="16" height="16" style="vertical-align: middle;"> **이미지로 저장**: 내 루트를 이미지로 저장하여 공유할 수 있습니다.

### :construction: 설치 및 실행

```sh
pnpm install
pnpm dev
# http://localhost:5173/route-calculator/v2 에서 실행가능
```

### :rocket: 빌드

```sh
pnpm run build
```

### :hammer: 테스트

```sh
pnpm test
```

### 기술 스택

- **Core**: React, TypeScript, Vite
- **Styling**: Vanilla CSS (Modular)
- **Testing**: Vitest
- **Icons**: @phosphor-icons/react
- **Utils**: @hello-pangea/dnd, html-to-image

### 문제 인식, 고민

1. 기존 앱의 불편함

   작동 자체가 안되는 문제, 파일을 다운로드해서 깔아야 하는데 불법 프로그램의 위험성 및 불안함이 존재

   → 웹앱으로 개발

2. 일랜시아의 직업 시스템

   여러 직업들에 따라서 스탯의 누적된 변동이 있다. 단순히 직업을 1부터 쌓아가기만 하면 큰 문제는 안되지만 중간에 새로운 직업을 껴넣을 수 있고, 삭제할 수 있고, 변경할 수 있도록 하고 싶었음

   - 앱의 편의성 고민

   → doubly linked list를 선택해보았음

3. 모바일

   반응형 웹으로 모바일 이용의 편의성을 강화해야 했다.

   → Custom CSS로 모바일에 최적화된 UI 구현

4. save & load

   기존 앱에서 파일로 save 해서 최적의 루트를 전달하는 등 공유가 많았음. 또, 현재 상태를 저장하고 이후 루트만 여러 차례에 걸쳐서 찍어보고 싶을 수도 있음

   → 파일 등이 아니라 link를 이용해서 save, load하면 좋겠다는 생각

   → 정보를 축약해서 query string으로 간단하게 나타낼 수 있는 방법 고민

   → 알파벳과 몇가지 특수문자로 정보 저장
