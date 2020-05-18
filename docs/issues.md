## issues

### Property 'for' does not exist on type 'DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>'

```jsx
<label htmlFor={this.props.inputId} className="input-label">
  {this.props.label}
</label>
```

- https://stackoverflow.com/questions/39187722/error-ts2339-property-for-does-not-exist-on-type-htmlpropshtmllabelelement

### 직업을 enum에 맞게 수정

```ts
["무도가", "투사", ...] // 와 같은 상황이 있었음

export enum Jobs {
  "무도가" = "무도가"
}// 와 같이 변경해야 했기 때문에

// RunJS에서 다음과 같이 출력해서 복붙함
jobs.reduce((accu, curr) => {
  accu.push(curr.replace(/([가-힣]*)/, `$1=$1`))
  return accu;
}, [])
```

#### 참고

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter

### 몫구하기

- Math.trunc() 이용
  - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

### No index signature with a parameter of type 'string' was found on type

- index signature 관련 문제, 자주 쓰이는건데 인식으로 못하고 있어서 이제까지 왜 이런 문제를 못만났는지 이해가 안됨

- https://basarat.gitbook.io/typescript/type-system/index-signatures
- https://itmining.tistory.com/87

### enum as interface key

To define an interface, the member names must be supplied not computed.

```ts
export interface colorsInterface {
  red: boolean;
  blue: boolean;
  green: boolean;
}
```

If you are worried about keeping the enum and the interface in sync you could use the following:

```ts
export interface colorsInterface {
  [color: number]: boolean;
}

var example: colorsInterface = {};
example[colorsEnum.red] = true;
example[colorsEnum.blue] = false;
example[colorsEnum.green] = true;
```

TypeScript is perfectly happy for you to pass the enum as the index and a rename-refactor would then keep everything together if you decided to rename red, for example.

- https://stackoverflow.com/questions/39701524/using-enum-as-interface-key-in-typescript

### duplicate identifier 에러

- skipLibCheck : true로 해줌
- https://stackoverflow.com/questions/50609517/error-ts2300-duplicate-identifier-requestinfo

### Object.entries가 없다.

- lib 를 es2017로 해야했음
- https://stackoverflow.com/questions/45422573/property-entries-does-not-exist-on-type-objectconstructor

### tsx type assertion

- <>을 쓸 수 없으므로 as 로 type assertion을 해야했음

```ts
Object.keys(jobPointMap[selectedJob] as EachJobPointMap).forEach((interval) => {
  if (nextJobPo % +interval === 0) intervals.push(interval as Intervals);
});
```

### parcel build 후 경로 에러

- `--public-url ./`를 해줘야 했다.
- https://github.com/parcel-bundler/parcel/issues/1092

### jest test import 문제

- bable.config.js에 Introduction의 아래 내용대로 추가했음

```js
// babel.config.js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
  ],
};
```

### powershell 명령어로 gh-pages 배포 자동화

- pipeline이 사용 가능하고
- pipeline object를 \$\_ 로 받을 수 있다.
- https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.management/join-path?view=powershell-7
- https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.management/remove-item?view=powershell-7

#### 참고

- https://sacstory.tistory.com/entry/PowerShell-%EA%B8%B0%EC%B4%88-%EB%AC%B8%EB%B2%95?category=841026

### npm-scripts로 폴더 삭제 (windows 10)

- node 모듈인 rimraf 라는 것을 사용하니까 할 수 있었다.

### source tab에서 src , node_modules 폴더가 보였던 것

- 강력 새로고침을 하니까 사라졌다.

### bulma variable 덮어쓰기가 안되던 것

- `To override any of these variables, just set them before importing Bulma.` 이 한줄을 안봐서 ..

#### 참고

- https://bulma.io/documentation/customize/variables/

### bulma 사용 후 모바일에서 반응 속도가 현저히 느려지던 문제

- td마다 uuid를 부여하고 속도가 개선됐다.
