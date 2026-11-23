# Semi Koh Portfolio

고세미의 프론트엔드 개발 포트폴리오입니다.

- `index.html`: 소개, 경력 요약, 개인 프로젝트, 오픈소스 기여
- `projects.html`: 실무·개인 프로젝트 목록
- `project-platform.html`: 쿠버네티스 관리 플랫폼 (SECloudit · DevOpsit)
- TicketLink: 경력 요약에서만 소개 (`project-ticketlink.html`은 해당 항목으로 이동)
- `project-gaia-office.html`: GAIA Office 공통 텍스트 기능
- `project-cloudbox.html`, `project-civichat.html`: 개인 프로젝트 상세

실무 프로젝트의 그림은 구현 구조를 설명하기 위한 개념도입니다.
Performance 이미지는 블로그의 비교 기록에서 Summary 부분만 사용합니다.

## 로컬 실행

```sh
python3 -m http.server 3020
```

http://localhost:3020 에서 확인합니다.

## 배포

`main` 브랜치에 푸시하면 GitHub Pages에서 자동 배포합니다.

https://semimikoh.github.io/portfolio/

## 로컬 프로젝트 상세 구성

- `projects.html`: 실무·개인 프로젝트 카드 목록
- `project-content.js`: 프로젝트별 소개, 역할, 시각 자료, 핵심 사례
- `project-modal.js`, `project-modal.css`: 상세 모달, 자료 탭, 프로젝트 전환
- `project-route.js`: 기존 상세 URL을 해당 프로젝트 모달로 연결

대표 실무 프로젝트는 GAIA Office와 쿠버네티스 관리 플랫폼입니다. 관련 없는 제품 소개 이미지와 경력 요약에 중복되는 설명은 제외했습니다.
현재 변경 사항은 로컬 검토용이며, 별도 요청 전에는 커밋·푸시하지 않습니다.
