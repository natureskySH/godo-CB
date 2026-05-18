# 고도 챗봇 위젯

강남고도미술학원 홈페이지에 `<script>` 한 줄로 임베드하는 통합 플로팅 위젯.

- 챗봇 (칩 기반 디시전 트리)
- 상담 신청 (외부 폼 새 탭)
- 전화 연결 (즉시 발신)
- PC/모바일 고정 플로팅 버튼
- 실제 홈페이지 우하단 `맨위로` 버튼과 함께 배치되도록 조정된 V2 UI

## V2 동작 요약

- 처음에는 우하단 세로 캡슐 버튼과 알림 말풍선만 노출됩니다.
- 챗봇을 열면 FAQ 칩만 먼저 보이고, 자유 텍스트 입력창은 없습니다.
- FAQ 칩을 누르면 짧은 타이핑 인디케이터 후 답변이 표시됩니다.
- 답변 아래에는 `처음으로`, `상담 전화 연결`, `방문 상담 예약` 칩이 순서대로 표시됩니다.
- 우하단 캡슐의 챗봇 아바타, 상담예약, 전화 버튼은 `data/chips.json`의 `consult`·`call` 칩을 참조합니다.
- 실제 홈페이지 팝업을 가리지 않도록 위젯 z-index는 사이트 팝업보다 낮게 조정되어 있습니다.

## 운영자 — 칩 답변 수정 가이드 (개발자 도움 없이)

이 위젯의 모든 칩과 답변은 `data/chips.json` 파일 하나로 관리됩니다.

### 1. 답변 수정

1. 이 GitHub 레포 페이지에서 `data/chips.json` 파일 클릭
2. 우상단 **연필 아이콘 (✏️)** 클릭
3. 원하는 칩의 `answer` 필드 텍스트 수정
4. 페이지 하단 **Commit changes** 버튼 클릭
5. 5분 이내에 위젯에 반영됨 (방문자는 페이지 새로고침 필요)

### 2. 칩 추가

`chips` 배열 맨 아래에 새 항목 추가:

```json
{
  "chip_id": "new_question",
  "label": "🎯 새 질문 라벨",
  "answer": "여기에 답변 본문을 적습니다.",
  "order": 6,
  "is_active": true
}
```

그리고 `main_menu` 배열에 `"new_question"` 추가하면 메인 메뉴에 노출됩니다.

### 3. 칩 비활성화

해당 칩의 `"is_active"` 값을 `false`로 바꾸면 노출되지 않습니다. 삭제하지 말고 비활성화해야 데이터가 보존됩니다.

### 4. 전화번호·상담 URL 변경

- 전화번호: `call` 칩의 `answer` 값 (`__ACTION_TEL__:` 뒤 번호) 수정
- 상담 URL: `consult` 칩의 `answer` 값 (`__ACTION_OPEN_URL__:` 뒤 URL) 수정

한 번 수정하면 위젯의 모든 진입점(우하단 컴포넌트 + 챗봇 내부 칩)이 자동 반영됩니다.

상담 URL은 보안상 `https://t.aca2000.co.kr/...` 주소만 열리도록 제한되어 있습니다. 다른 예약 도메인을 써야 하면 코드 수정이 필요합니다.

## 보안

이 레포는 Public입니다. 다음 정보는 절대 커밋하지 마세요:

- `.env` 파일·API 키·비밀번호
- 학생/학부모 개인정보
- 학원 내부 운영 자료

`chips.json`은 공개되므로, FAQ 답변·전화번호·상담 URL 등 **이미 학원 홈페이지에 공개된 정보만** 포함합니다.

## 개발자 문서

### 로컬 검증

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm run lint
npm run format
```

개발 서버 실행 후 아래 주소에서 확인합니다.

- 실제 홈페이지 정적 복제 검수: `http://127.0.0.1:5173/demo/godoart-static.html`
- 간단 위젯 검수: `http://127.0.0.1:5173/demo/index.html`
- 실제 홈페이지 iframe 검수: `http://127.0.0.1:5173/demo/godoart-live.html`

`demo/godoart-live.html`은 실제 `http://www.godoart.com/default/index.php`를 iframe으로 띄우는 로컬 검수용입니다. GitHub Pages처럼 HTTPS로 제공되는 페이지에서는 브라우저의 mixed content 정책 때문에 iframe이 차단될 수 있습니다.

빌드 후 `dist/`에는 아래 파일이 생성됩니다.

- `godo-chatbot.js`
- `chips.json`
- `chatbot-avatar.png`

### 홈페이지 임베드

GitHub Pages 배포 후 홈페이지에는 아래 한 줄만 추가합니다.

```html
<script src="https://natureskysh.github.io/godo-CB/godo-chatbot.js" defer></script>
```

위젯은 스크립트 파일 위치를 기준으로 `chips.json`과 `chatbot-avatar.png`를 불러옵니다. 따라서 세 파일은 같은 배포 경로에 있어야 합니다.

상세 사양·아키텍처 문서는 별도 보관됩니다. 구현 관련 문의는 관리자에게 요청.
