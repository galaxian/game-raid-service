#

## 1️⃣ 프로젝트 설명⚡️

<pre>
프리온보딩 4번째 과제

</pre>

</br>

## 2️⃣ 프로젝트 요약🌈

- 기간 : 2022.09.16 ~ 2022.09.21
- 개발 언어 : Javascript
- 개발 라이브러리 : NestJs
- DB : MySQL

</br>

## 3️⃣ ERD✨

</br></br>

</br>

## 4️⃣ API 명세✨

</br></br>

## 5️⃣ 요구사항 분석🌟

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
     - 레이드 제한 시간 초과 시 예외 처리
   - 보스 레이드 랭킹 조회
     - totalScore의 내림차순으로 조회
       </br>

## 6️⃣ 트러블 슈팅🚀

</br>

## 7️⃣ 사용한 라이브러리(패키지)
