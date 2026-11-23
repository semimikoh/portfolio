window.PORTFOLIO_PROJECTS = [
  {
    "id": "gaia-office",
    "file": "project-gaia-office.html",
    "title": "GAIA Office",
    "company": "TMAX GAIA · 2023.09 — 2025.02",
    "category": "실무",
    "subtitle": "MS Office·한글 문서 포맷 호환과 실시간 공동 편집을 지원하는 웹 기반 오피스 제품",
    "role": "Word·PowerPoint·Excel의 공통 텍스트 기능 개발·안정화",
    "summary": "입력·캐럿·붙여넣기 기능을 다루며 텍스트 편집 동작과 렌더링을 개선했습니다.",
    "tags": [
      "React",
      "TypeScript",
      "MobX",
      "Canvas"
    ],
    "body": "<section class=\"pm-story\"><h3>문제 상황</h3><p>외부 문서를 붙여넣으면 Office 전용 스타일과 중첩된 표·목록이 섞인 HTML이 들어왔습니다. 이를 화면에 그대로 표시하는 대신, 다시 편집하고 저장하며 공동 편집에 사용할 수 있는 에디터의 문서 모델로 변환해야 했습니다.</p></section><section class=\"pm-story\"><h3>해결 과정</h3><ul><li>태그별 변환기가 모델 생성 → 자식 노드 변환 → 후처리 순서를 따르도록 리팩토링했습니다.</li><li>공통 변환 흐름은 상위 클래스에 두고, 태그별 처리와 변환기 생성 책임을 분리했습니다. 중첩된 문서 구조도 같은 흐름으로 처리하도록 했습니다.</li><li>주요 에디터의 복사·붙여넣기 동작을 비교하고, 같은 문서 유형 사이에서는 스타일과 구조를 더 많이 보존하도록 기획자와 호환 기준을 조율했습니다.</li></ul></section><section class=\"pm-story\"><h3>결과</h3><p>외부 HTML을 문서 모델로 바꾸는 흐름을 구조화하고, 붙여넣기 호환 요구사항을 구현 기준으로 구체화했습니다. 문서를 보여주는 방식과 에디터가 문서를 다루는 구조를 분리해 생각하게 된 사례입니다.</p></section><section class=\"pm-story\"><h3>설계에서 중요했던 점</h3><p>붙여넣기는 HTML을 렌더링하는 기능을 넘어, 문서의 구조와 의미를 해석하는 작업이었습니다. 공통 처리 순서는 유지하면서 태그별 차이를 어디에 둘지 정하는 것이 중요했습니다.</p></section><div class=\"pm-reading\"><a href=\"https://colonni.xyz/ko/posts/editor-paste-domain-logic\" target=\"_blank\" rel=\"noopener noreferrer\">붙여넣기 도메인 로직 설계 ↗</a></div><details class=\"pm-more\"><summary>입력·캐럿과 레이아웃 개선 경험</summary><ul><li>React 18 전환 후 텍스트와 캐럿의 업데이트 순서를 분석하고, 로컬·원격 입력을 구분해 렌더링을 안정화했습니다.</li><li>줄바꿈 탐색 최적화로 당시 입력 처리 시간을 26.53ms에서 13.41ms로 줄였습니다. 회전된 도형에서 입력 위치와 캐럿을 맞추는 기하 계산도 다뤘습니다.</li></ul><div class=\"pm-reading\"><a href=\"https://colonni.xyz/ko/posts/react-18-cursor-rendering\" target=\"_blank\" rel=\"noopener noreferrer\">React 18의 렌더링 순서 ↗</a><a href=\"https://colonni.xyz/ko/posts/algorithm-frontend-optimization\" target=\"_blank\" rel=\"noopener noreferrer\">줄바꿈 탐색 최적화 ↗</a></div></details>",
    "visuals": [
      {
        "label": "붙여넣기 처리",
        "caption": "외부 HTML을 편집·저장할 수 있는 내부 문서 모델로 변환하는 흐름입니다.",
        "html": "<div class=\"editor-pipeline\" role=\"group\" aria-label=\"외부 HTML을 에디터 문서 모델로 변환하는 붙여넣기 구조\"><div class=\"diagram-heading\"><span>붙여넣기는 HTML을 보여주는 일 이상이었습니다</span><span class=\"diagram-label\">변환 구조</span></div><div class=\"paste-endpoints\"><div><span class=\"diagram-label\">입력</span><h2>외부 HTML</h2><p>Word · Excel · 웹페이지</p><div class=\"paste-fragments\" aria-hidden=\"true\"><span>텍스트 서식</span><span>중첩된 표</span><span>목록 · 이미지</span></div></div><div><span class=\"diagram-label\">출력</span><h2>에디터 문서 모델</h2><p>편집 · 저장 · 공동 편집에 사용할 구조</p><div class=\"document-tree\" aria-hidden=\"true\"><b>문서</b><span>문단 · 스타일</span><span>표 · 셀 · 텍스트</span></div></div></div><div class=\"paste-process\"><span>DOMParser</span><i aria-hidden=\"true\">→</i><span>태그별 변환기</span><i aria-hidden=\"true\">→</i><span>자식 노드 변환 · 후처리</span></div></div>"
      },
      {
        "label": "입력과 캐럿",
        "caption": "캐럿은 텍스트의 실제 위치를 확인한 뒤 표시해야 합니다. React 업데이트 순서와 이 의존 관계를 함께 분석했습니다.",
        "html": "<div class=\"pm-flow\"><div><strong>텍스트 입력</strong><span>로컬·원격 입력 구분</span></div><div><strong>텍스트 DOM 반영</strong><span>위치와 크기를 확인</span></div><div><strong>캐럿 렌더링</strong><span>텍스트의 실제 위치에 표시</span></div></div>"
      },
      {
        "label": "줄바꿈 최적화",
        "caption": "당시 측정한 텍스트 입력 처리 시간입니다. 한 줄에 들어가는 텍스트의 길이를 찾는 탐색 방식을 바꾸었습니다.",
        "html": "<div class=\"pm-timing\"><div><span>기존 텍스트 입력 처리</span><strong>26.53<small>ms</small></strong><div class=\"pm-bar before\"></div></div><div><span>줄바꿈 탐색 최적화 후</span><strong>13.41<small>ms</small></strong><div class=\"pm-bar after\"></div></div><p>줄바꿈 지점을 찾는 탐색을 선형 탐색에서 이분 탐색으로 변경</p></div>"
      }
    ]
  },
  {
    "id": "platform",
    "file": "project-platform.html",
    "title": "쿠버네티스 관리 플랫폼",
    "company": "이노그리드 · NHN Injeinc",
    "category": "실무",
    "subtitle": "SECloudit · DevOpsit — 클라우드 자원 관리와 애플리케이션의 빌드·배포를 지원하는 플랫폼",
    "role": "그래프 시각화 · 실시간 진행 상태와 상세 로그 개발",
    "summary": "Canvas와 DOM의 역할을 나눠 그래프 렌더링을 개선하고, 실시간 상태와 로그를 연결했습니다.",
    "tags": [
      "React",
      "TypeScript",
      "Canvas",
      "WebSocket"
    ],
    "body": "<section class=\"pm-story\"><h3>문제 상황</h3><p>리소스가 늘어날수록 그래프를 확대·축소하거나 이동할 때 반응이 늦어졌습니다. 각 노드는 상태뿐 아니라 상세 정보와 액션 메뉴도 제공해야 했기 때문에, 모든 요소를 Canvas로 바꾸는 것만으로는 기존 사용 흐름을 유지하기 어려웠습니다.</p></section><section class=\"pm-story\"><h3>해결 과정</h3><ul><li>전체 관계를 보여주는 부분과 개별 노드를 조작하는 부분을 구분했습니다. 노드 수와 줌 배율에 따라 Canvas와 DOM을 전환하도록 했습니다.</li><li>기존 그래프의 위치·크기·연결선 경로를 함께 사용해, 렌더링 방식이 달라져도 노드가 같은 자리에 표시되도록 했습니다.</li><li>Canvas에서 클릭 좌표로 대상을 찾고, 선택한 노드만 기존 React 컴포넌트로 표시했습니다. 같은 노드는 Canvas에서 제외하고 최근 선택한 최대 12개만 DOM으로 유지했습니다.</li></ul></section><section class=\"pm-story\"><h3>결과</h3><ul><li>전체 관계를 한눈에 보여주면서 선택한 노드의 기존 액션 메뉴를 유지했습니다.</li><li>합성 리소스 250개의 동일한 줌 반복 비교에서 Scripting 합계가 5,036ms에서 344ms로 줄었습니다. 측정 조건과 분석은 관련 글에 정리했습니다.</li></ul></section><section class=\"pm-story\"><h3>설계에서 중요했던 점</h3><p>많은 정보를 한꺼번에 보여주는 일과 하나를 선택해 조작하는 일에 서로 다른 렌더링 방식을 적용했습니다. Canvas와 DOM 사이에서 배치와 선택 상태를 공유하는 경계를 정하는 것이 중요했습니다.</p></section><div class=\"pm-reading\"><a href=\"https://colonni.xyz/ko/posts/dom-canvas-hybrid-rendering\" target=\"_blank\" rel=\"noopener noreferrer\">DOM·Canvas 구현과 측정 기록 ↗</a></div><details class=\"pm-more\"><summary>실시간 진행 상태와 로그 처리</summary><p>빌드·배포 진행 상황과 단계별 로그를 단일 WebSocket 연결에서 구분해 수신하고, 예기치 않은 연결 종료 후 활성 구독을 복원해 조회 흐름을 이어가도록 했습니다.</p></details>",
    "visuals": [
      {
        "label": "렌더링 구조",
        "caption": "노드의 배치 정보를 공유하면서 Canvas와 DOM의 역할을 나눈 구조입니다.",
        "html": "<div class=\"render-diagram\" role=\"group\" aria-label=\"같은 그래프 배치 정보를 Canvas와 선택한 DOM 노드가 공유하는 구조\"><div class=\"diagram-heading\"><span>같은 그래프, 서로 다른 역할</span><span class=\"diagram-label\">렌더링 구조</span></div><div class=\"layout-source\">노드의 위치·크기 · 연결선 경로<span>한 번 계산한 배치 정보 공유</span></div><div class=\"render-branches\"><div class=\"render-branch\"><span class=\"diagram-label\">전체 관계</span><h2>Canvas</h2><div class=\"mini-graph\" aria-hidden=\"true\"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><p>많은 노드와 연결선을 함께 표시</p></div><div class=\"render-branch selected-branch\"><span class=\"diagram-label\">선택한 대상</span><h2>DOM</h2><div class=\"node-focus\" aria-hidden=\"true\"><span>선택한 노드</span><b>상세 정보 · 액션 메뉴</b></div><p>클릭한 노드의 기존 UI와 이벤트 유지</p></div></div><p class=\"diagram-footnote\">선택한 노드는 Canvas에서 제외하고, 같은 위치에 DOM 컴포넌트로 표시</p></div>"
      },
      {
        "label": "Performance 비교",
        "caption": "합성 리소스 250개의 동일 줌 반복 기록입니다. 각 경로의 전체 동작을 집계한 Scripting 합계를 비교했습니다.",
        "html": "<div class=\"pm-performance\"><div class=\"pm-metric\"><span>DOM 경로</span><strong>5,036<small>ms</small></strong><img src=\"assets/platform/dom-summary.png\" alt=\"DOM 경로의 Performance Summary: Scripting 5,036ms\"></div><div class=\"pm-metric\"><span>Canvas 경로</span><strong>344<small>ms</small></strong><img src=\"assets/platform/canvas-summary.png\" alt=\"Canvas 경로의 Performance Summary: Scripting 344ms\"></div></div>"
      }
    ]
  },
  {
    "id": "cloudbox",
    "file": "project-cloudbox.html",
    "title": "Cloudbox",
    "company": "개인 프로젝트",
    "category": "개인",
    "subtitle": "브라우저에서 LiDAR 점군을 확인하고 3D 바운딩 박스를 편집하는 라벨링 도구",
    "role": "점군 파일 처리 · 3D 편집 · 카메라 투영 · 실행 취소 구조 구현",
    "summary": "점군 파일의 처리와 화면 조작을 분리하고 3D·2D 편집 흐름을 연결했습니다.",
    "tags": [
      "React",
      "TypeScript",
      "Three.js",
      "Web Worker"
    ],
    "body": "<section class=\"pm-story\"><h3>문제 상황</h3><p>점군 파일을 읽는 계산이 사용자 입력과 같은 메인 스레드에서 실행되면 화면 조작을 지연시킬 수 있습니다. 파싱을 다른 스레드로 옮겨도 큰 배열을 매번 복사하면 전송 비용과 메모리가 늘어납니다.</p></section><section class=\"pm-story\"><h3>해결 과정</h3><ul><li>ArrayBuffer를 Web Worker에 넘겨 점의 위치·강도를 계산하고, 입력과 결과 버퍼를 transfer 목록으로 전달했습니다.</li><li>Worker는 요청별로 생성하고 성공·실패·취소 시 종료했습니다. 화면은 변경이 있을 때 렌더링하고 표시할 점의 비율을 조절하도록 했습니다.</li><li>드래그 중에는 미리보기 상태를 갱신하고 마우스를 놓을 때 한 번만 편집 이력에 반영해, 한 번의 조작이 한 번의 실행 취소로 돌아가도록 했습니다.</li></ul></section><section class=\"pm-story\"><h3>결과와 확인</h3><p>파일 처리와 화면 조작의 실행 경로를 분리했습니다. 파싱 형식·실패 조건과 undo/redo 규칙을 테스트에 포함했습니다. 카메라 투영 계산은 OpenCV로 만든 기준 좌표와 소수점 셋째 자리 수준으로 비교하는 골든 테스트로 확인하도록 했습니다.</p></section><section class=\"pm-story\"><h3>설계에서 중요했던 점</h3><p>파일 파싱, 화면 렌더링, 편집 이력은 서로 다른 작업입니다. 각각의 실행 위치와 갱신 시점을 구분해 한 작업이 다른 작업을 불필요하게 반복시키지 않도록 했습니다.</p></section>",
    "live": "https://cloudbox-plum.vercel.app",
    "visuals": [
      {
        "label": "실행 화면",
        "caption": "개인 프로젝트 Cloudbox의 실제 실행 화면입니다.",
        "html": "<figure class=\"pm-personal-shot\"><img src=\"assets/cloudbox.png\" alt=\"Cloudbox의 점군·3D 바운딩 박스 편집 화면\"></figure>"
      },
      {
        "label": "파일 처리 구조",
        "caption": "파일을 해석하는 작업은 Worker에서 처리하고, 큰 버퍼는 복제 대신 소유권을 전달합니다.",
        "html": "<div class=\"pm-flow\"><div><strong>PCD 파일</strong><span>ArrayBuffer</span></div><div><strong>Web Worker</strong><span>점 좌표 · 강도 해석</span></div><div><strong>3D 장면</strong><span>버퍼 전달 · 표시</span></div></div>"
      }
    ]
  },
  {
    "id": "civichat",
    "file": "project-civichat.html",
    "title": "CiviChat",
    "company": "개인 프로젝트",
    "category": "개인",
    "subtitle": "자연어로 복지 혜택과 법령을 검색하고 결과와 AI 요약을 확인하는 서비스",
    "role": "검색·SSE 응답 처리 · 메시지 가상화 · 후속 질문 문맥 설계",
    "summary": "검색 결과를 먼저 보여주고 AI 요약은 이어서 전달하는 대화형 검색 경험을 만들었습니다.",
    "tags": [
      "Next.js",
      "TypeScript",
      "SSE",
      "TanStack Virtual"
    ],
    "body": "<section class=\"pm-story\"><h3>문제 상황</h3><p>검색 결과를 찾은 뒤에도 AI 요약이 끝날 때까지 기다리게 하면 사용자는 검색이 성공했는지 알 수 없습니다. 요약 생성만 실패했을 때 이미 찾은 결과까지 버리는 것도 피하고 싶었습니다.</p></section><section class=\"pm-story\"><h3>해결 과정</h3><ul><li>검색 결과를 먼저 전달하고 AI 요약을 SSE로 이어서 수신하도록 했습니다. 결과와 요약의 로딩·오류 상태를 분리했습니다.</li><li>수신 청크를 TextDecoder와 버퍼로 처리해 잘린 이벤트를 복원하고, 요약이 실패하더라도 이미 도착한 결과 카드는 유지했습니다.</li><li>긴 대화는 Canvas 기반 텍스트 높이 추정과 가상 리스트로 표시 범위를 조절했습니다. 법령 검색의 후속 질문에는 필요한 경우에만 이전 질문의 문맥을 보강했습니다.</li></ul></section><section class=\"pm-story\"><h3>결과와 확인</h3><p>검색 결과와 요약 생성이 독립적으로 진행되도록 구성했습니다. 이벤트 순서, 잘린 청크 복원, 요약 실패 시 결과 유지, 새 주제와 후속 질문의 구분을 테스트로 확인했습니다.</p></section><section class=\"pm-story\"><h3>설계에서 중요했던 점</h3><p>응답 전체를 하나의 성공·실패로 다루는 대신, 사용자에게 이미 제공할 수 있는 정보와 아직 생성 중인 정보를 나누었습니다. 기다림과 실패가 화면에서 어떻게 보이는지까지 함께 설계했습니다.</p></section>",
    "live": "https://civichat-kappa.vercel.app",
    "visuals": [
      {
        "label": "검색 화면",
        "caption": "검색 결과와 AI 요약을 대화 안에서 확인하는 실제 동작입니다.",
        "html": "<figure class=\"pm-personal-shot\"><img src=\"assets/civichat.gif\" alt=\"CiviChat의 복지 혜택 검색과 AI 요약 흐름\"></figure>"
      },
      {
        "label": "응답 처리 흐름",
        "caption": "검색 결과와 요약의 상태를 구분하고, 요약이 실패해도 이미 찾은 정보는 유지합니다.",
        "html": "<div class=\"pm-flow\"><div><strong>질문 입력</strong><span>검색 요청</span></div><div><strong>검색 결과</strong><span>먼저 화면에 표시</span></div><div><strong>AI 요약</strong><span>SSE로 이어서 갱신</span></div></div>"
      }
    ]
  }
];
