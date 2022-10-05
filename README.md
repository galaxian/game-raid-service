#

## 프로젝트 설명⚡️

<pre>
프리온보딩 4번째 과제

- 보스 레이드를 할 수 있는 서비스입니다.
- 레이드에는 동시에 1명의 유저만 입장할 수 있습니다.
- 보스의 레벨을 선택하여 입장할 수 있습니다.
- 레이드의 랭킹을 확인할 수 있습니다.

</pre>

</br>

## 프로젝트 요약🌈

- 기간 : 2022.09.16 ~ 2022.09.21
- 개발 언어 : Javascript
- 개발 프레임워크 : NestJs
- DB : MySQL

</br>

## 프로젝트 설정

### 1. YML

```
server:
  port:

db:
  port:
  type:
  database:
  host:
  username:
  password:
  synchronize:

redis:
  host:
  port:

boss_url:
```

/config/develop.yml 에 develop 환경 설정

/config/test.yml 에 test 환경 설정

</br>

### 2. 실행 및 테스트

실행 방법

```
yarn install
yarn start
```

테스트 방법

```
yarn test
```

swagger

- http://localhost:3000/api-docs

</br>

## ERD✨

<details>
<summary>레이드 입장 가능</summary>
<img width="800" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/1114b7a2-d826-4dff-ab4d-e24009d1f4cc/image.png">
</details>

</br>

## API 명세✨

[API 명세](https://www.notion.so/d808ad1c36c34f92926088753e8a9021?v=f2b4b021cfe5436b9023778315c11c9c)

<details>
<summary>유저 생성</summary>
<img width="300" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/96e97839-39e1-4b76-850a-db2e1a7213db/image.png">
</details>

<details>
<summary>유저 레이드 정보 조회</summary>
<img width="300" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/4f892212-7f2d-4a22-a5cf-cb40c149762e/image.png">
</details>

<details>
<summary>레이드 입장 가능</summary>
<img width="300" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/fb2fa266-9923-42d5-9956-12ff3f97ba7e/image.png">
</details>

<details>
<summary>레이드 입장 불가</summary>
<img width="300" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/d465e63d-9b42-4e8e-aac6-0c6a157f1d5b/image.png">
</details>

<details>
<summary>레이드 입장</summary>
<img width="300" alt="image" src="https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1cfc4df1-9bce-46b2-b8ad-10cb55d5522e/%EB%B3%B4%EC%8A%A4%EB%A0%88%EC%9D%B4%EB%93%9C_%EC%9E%85%EC%9E%A5.png">
</details>

<details>
<summary>레이드 종료</summary>
<img width="300" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/2f1f3ce3-72dc-46e8-9bdd-dcb75d99c508/image.png">
</details>
    
<details>
<summary>레이드 랭킹 조회</summary>
<img width="300" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/6175017b-134b-4609-b25e-080c031d84d3/image.png">
</details>

</br></br>

## 요구사항 분석🌟

1. 유저
   - 유저 생성
     - 중복되지 않는 값이어야 하므로 pk를 사용
     - 응답 데이터는 pk
   - 유저 조회
     - userId를 사용해 유저 정보 조회
     - NotFoundException 처리 필요
     - 응답 데이터는 보스 레이드 총 점수 및 참여 기록 포함
2. 보스 레이드
   - 보스 레이드 상태 조회
     - 보스 레이드 상태를 응답
       - 입장 가능 유무 boolean
       - (진행중인 경우) 진행 중인 유저의 userId
     - 입장 조건 응답
       - 보스 레이드 시작 기록이 없을 시
       - 시작 유저가 보스레이드 종료 or 레이드 시간 경과
   - 보스 레이드 시작
     - userId와 level을 request로 받아야 한다.
     - 레이드가 시작 가능한 경우 중복되지 않는 raidRecordId 및 boolean 값을 true 응답
     - 레이드가 불가능한 경우 boolean 값만 false로 응답
   - 보스 레이드 종료
     - 레이드 level에 따른 score 반영 및 raidRecordId 종료 처리
     - userId, raidRecordId 유효성 검사
       - 없으면 NotFoundException
   - 보스 레이드 랭킹 조회
     - totalScore의 내림차순으로 조회
     - 랭킹 정보 레디스에 캐싱 처리
   - 보스 레이드 정보 조회 - axios를 사용해 static data로 사용 - 자주 사용할 정보이므로 캐싱 처리
     </br>

## 테스트 코드

<details>
<summary>userService 단위 테스트</summary>
<img width="400" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/66029236-e72a-4aac-b7fe-63b16070949a/image.png">
</details>

</br></br>

## 트러블 슈팅🚀

### 1. 테스트 코드 작성 시 의존성 분리 문제

- 문제 상황 :
  - 테스트 코드 작성 중 Redis에 의존성을 갖는 문제
- 원인
  - raid service가 Redis에 의존성을 주입 받아 테스트 코드에서 의존성 처리 필요
  - Redis를 mocking 하는 방법을 찾지 못해 실제 Redis 환경에서 동작
- 해결 방안 1
  - 테스트 용도의 Redis를 따로 동작하여 사용
- 해결 방안 2
  - Redis를 mocking 하는 방법을 찾아 테스트 코드에서 사용

### 2. axios 응답 객체(observable)

- 문제 상황
  - 테스트 코드에서 firstValueFrom 메서드가 동작하지 않는 문제
- 원인
  - axios의 httpService.get() 메서드의 반환 타입이 promise가 아닌 observable 객체
- 해결 방안
  - observable 객체에 대한 공부 필요

### 3. 랭킹 조회 시 동점자들의 랭킹이 다르게 표시되는 문제

- 문제 상황
  - 랭킹 조회 시 동점자의 랭킹이 다르게 표시되는 문제
- 원인
  - Redis의 정렬 방식에 따른 index + 1을 랭킹으로 하도록 설정을 해 놓았기 때문에 동점자들의 랭킹이 다르게 출력
- 해결 방안
  - Redis의 명령어를 사용해 같은 점수는 같은 index 값을 갖도록 변형
  ```javascript
  const score = await this.redis.zscore('raidRank', element);
  const sameScoreList = await this.redis.zrevrangebyscore(
    'raidRank',
    score,
    score,
  );
  const rankIdx = sameScoreList[0];
  const rank = await this.redis.zrevrank('raidRank', rankIdx);
  ```
    </br>

## 사용한 라이브러리(패키지)

| 라이브러리명    | 내용                  | 참고                           |
| :-------------- | :-------------------- | :----------------------------- |
| jest            | 테스트                | 단위테스트 및 e2e 테스트       |
| typeorm         | ORM                   | 데이터베이스와 연결            |
| class-validator | 유효성 체크           |                                |
| IoRedis         | 캐시                  | 자주 사용하는 데이터 캐싱 처리 |
| axios           | 외부 json 데이터 사용 |                                |
| swagger         | API 문서화            |                                |
