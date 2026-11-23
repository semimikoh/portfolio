# Semi Koh Portfolio

고세미의 프론트엔드 개발 포트폴리오입니다.

- `index.html`: 소개, 경력 요약, 개인 프로젝트, 오픈소스 기여
- `projects.html`: 실무·개인 프로젝트 목록
- `project-platform.html`: 쿠버네티스 관리 플랫폼 (SECloudit · DevOpsit)
- `project-ticketlink.html`: TicketLink 글로벌·일본 서비스
- `project-gaia-office.html`: GAIA Office 공통 텍스트 기능
- `project-cloudbox.html`, `project-civichat.html`: 개인 프로젝트 상세

실무 프로젝트의 그림은 구현 구조를 설명하기 위한 개념도입니다.
Performance 이미지는 블로그의 비교 기록에서 Summary 부분만 사용합니다.

## 로컬 실행

```sh
python3 -m http.server 3021
```

http://localhost:3021 에서 확인합니다.

## 배포

`main` 브랜치에 푸시하면 GitHub Pages에서 자동 배포합니다.

https://semimikoh.github.io/portfolio/
