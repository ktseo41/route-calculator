## 일랜시아 루트 계산기

![routegif](https://i.imgur.com/3nxjGrJ.gif)

### :joystick: 넥슨 고전게임 일랜시아의 직업포인트에 따른 스탯 계산기입니다.

### :construction: 설치 및 실행

```sh
npm i
npm start
# http://localhost:1234 에서 계산기 실행가능
```

### :rocket: 빌드

```sh
npm i
npm run build
```

### :hammer: 테스트

```sh
npm i
npm test
```

### 기술 스택

- React
- TypeScript
- bulma
- parceljs
- jest

### 문제 인식, 고민

1. 기존 앱의 불편함

   작동 자체가 안되는 문제, 파일을 다운로드해서 깔아야 하는데 불법 프로그램의 위험성 및 불안함이 존재

- 웹앱으로 개발

2. 일랜시아의 직업 시스템

   여러 직업들에 따라서 스탯의 누적된 변동이 있다. 단순히 직업을 1부터 쌓아가기만 하면 큰 문제는 안되지만 중간에 새로운 직업을 껴넣을 수 있고, 삭제할 수 있고, 변경할 수 있도록 하고 싶었음

- 앱의 편의성 고민
- doubly linked list로 선택해보기로

3. 모바일

   반응형 웹으로 모바일 이용의 편의성을 강화해야 했다.

- css framework를 이용하기로. bulma를 택했다. 많이 쓰이는 것들 중에 선택

4. save & load

   기존 앱에서 파일로 save 해서 최적의 루트를 전달하는 등 공유가 많았음. 또, 현재 상태를 저장하고 이후 루트만 여러 차례에 걸쳐서 찍어보고 싶을 수도 있음

- 파일 등이 아니라 link를 이용해서 save, load하면 좋겠다는 생각
- 정보를 축약해서 query string으로 간단하게 나타낼 수 있는 방법 고민
- 알파벳과 몇가지 특수문자로 정보 저장
