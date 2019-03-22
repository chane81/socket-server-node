# 소켓전송 서버

## 구성
- server
  > node.js

- type check compiler
  > typescript

- deploy
  > heroku

- source controller
  > git
  
  > heroku git

- code 리팩토링 관련툴
  > https://www.codefactor.io/repository/github/chane81/socket-server-node

# heroku

## heroku 버전
- heroku --version

## login
heroku login -i

## 로그 실시간 보기
- heroku logs -t

## git 릴리즈 보기
- heroku releases

## 해당버전으로 롤백
- heroku rollback v12

## 3rd-party buildpacks
- heroku plugins:install heroku-repo

## 브랜치 push
- git push heroku testbranch:master(브랜치 푸쉬)

## scale
- heroku ps:scale web=1

## 배포
```
heroku login
heroku remote -v
heroku git:remote -a socket-client-node
git add .
git commit -m "수정내역"
git push -f heroku master
heroku logs -t
heroku logs -a socket-server-node -t
```
