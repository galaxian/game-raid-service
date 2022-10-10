## 목차

1. [프로젝트 설명](#프로젝트-설명⚡️)
2. [프로젝트 요약](#프로젝트-요약🌈)
3. [프로젝트 설정](#프로젝트-설정)
4. [ERD](#ERD✨)
5. [API](#API✨)
6. [요구사항 분석](#요구사항-분석🌟)
7. [테스트 코드](#테스트-코드)
8. [조회 속도 개선](#조회-속도-개선)
9. [트러블 슈팅](#트러블-슈팅🚀)
10. [사용한 라이브러리](#사용한-라이브러리)

</br>

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
<summary>ERD</summary>
<img width="600" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/1114b7a2-d826-4dff-ab4d-e24009d1f4cc/image.png">
</details>

</br>

## API✨

[API 명세](https://www.notion.so/d808ad1c36c34f92926088753e8a9021?v=f2b4b021cfe5436b9023778315c11c9c)

<details>
<summary>유저 생성</summary>
<img width="800" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/96e97839-39e1-4b76-850a-db2e1a7213db/image.png">
</details>

<details>
<summary>유저 레이드 정보 조회</summary>
<img width="800" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/4f892212-7f2d-4a22-a5cf-cb40c149762e/image.png">
</details>

<details>
<summary>레이드 입장 가능</summary>
<img width="800" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/fb2fa266-9923-42d5-9956-12ff3f97ba7e/image.png">
</details>

<details>
<summary>레이드 입장 불가</summary>
<img width="800" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/a3a3c102-d186-4532-a29a-8deed4e86102/image.png">
</details>

<details>
<summary>레이드 입장</summary>
<img width="800" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/925be148-eb9d-4f2b-8b0c-c9d68682ea87/image.png">
</details>

<details>
<summary>레이드 종료</summary>
<img width="800" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/2f1f3ce3-72dc-46e8-9bdd-dcb75d99c508/image.png">
</details>
    
<details>
<summary>레이드 랭킹 조회</summary>
<img width="800" alt="image" src="https://velog.velcdn.com/images/jhlee123/post/6175017b-134b-4609-b25e-080c031d84d3/image.png">
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

## 조회 속도 개선

### 테스트 방식

console.time()을 랭킹 조회 로직에 사용하여 redis와 mysql 각각 10회 평균을 구하였다.

```typescript
console.time('test');

const rankerList = await this.getRankerListFromRedis();

// const rankerList = await this.getRankerListFromRDB()

console.timeEnd('test');
```

</br>

### 평균 응답 시간

| 조회 데이터 수 | RDB     | Redis   | 시간차  | 감소율 |
| -------------- | ------- | ------- | ------- | ------ |
| 1              | 1.257ms | 0.898ms | 0.359ms | 28.6%  |
| 5              | 1.307ms | 1.080ms | 0.227ms | 17.4%  |
| 10             | 1.709ms | 1.149ms | 0.56ms  | 32.8%  |
| 25             | 2.184ms | 2.209ms | 0.713ms | 32.6%  |
| 50             | 3.442ms | 2.887ms | 0.555ms | 16.1%  |

</br>

### 분석

1. 테스트 진행 시 조회 할 랭커 수에 따라 조회 성능이 증가할 것이라 생각하고 시행
   - 인원 수가 증가할 수록 효율이 감소하는 현상 발생

</br>

2. 예상 결과와 달라 redis의 조회 메서드과 typeorm의 조회 메서드에 각각 속도 테스트 시행

   ```typescript
   //mysql 랭킹 조회
   console.time('rdb');
   const userList: User[] = await this.userService.findAllUser();
   console.timeEnd('rdb');

   //redis 랭킹 조회
   console.time('redis');
   const rankList = await this.redis.zrevrange('raidRank', 0, -1);
   console.timeEnd('redis');
   ```

   - 조회 데이터 50개 기준으로 redis 평균 0.2ms, mysql 평균 3ms 확인

</br>

3. 결론
   - 랭킹을 조회할 경우 redis는 조회를 여러번 시행하는데 mysql은 한번에 가져오도록 하기 때문이라 생각
   - redis 조회 로직의 이해가 부족하여 비효율적인 코드일 가능성

</br>

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

## 사용한 라이브러리

| 라이브러리명    | 내용                  | 참고                           |
| :-------------- | :-------------------- | :----------------------------- |
| jest            | 테스트                | 단위테스트 및 e2e 테스트       |
| typeorm         | ORM                   | 데이터베이스와 연결            |
| class-validator | 유효성 체크           |                                |
| IoRedis         | 캐시                  | 자주 사용하는 데이터 캐싱 처리 |
| axios           | 외부 json 데이터 사용 |                                |
| swagger         | API 문서화            |                                |
