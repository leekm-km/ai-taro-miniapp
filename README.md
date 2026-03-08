# AI 타로오빠 - 토스 미니앱 (앱인토스)

AI 기반 타로 리딩 서비스. 5명의 개성 넘치는 타로술사와 함께 GPT-4o-mini가 카드 리딩을 제공합니다.

**[앱인토스 등록 페이지 →](https://toss.im/apps-in-toss)**

---

## 기술 스택

| | 기술 |
|---|---|
| 프론트엔드 | React 19 + TypeScript + Vite |
| 토스 SDK | `@apps-in-toss/web-framework` (콘솔 등록 후 적용) |
| 백엔드 | FastAPI (Python) |
| AI | OpenAI GPT-4o-mini |
| 배포 | Railway (백엔드), 앱인토스 콘솔 (프론트) |

---

## 앱 플로우

```
언어 선택 → 캐릭터 선택 → 운세 카테고리 → 질문 입력
  → 카드 선택 (부채꼴 16장) → 카드 공개 (3D 뒤집기)
  → 광고 (병렬 API 호출) → GPT 타로 리딩
  → 추가질문 (광고 + 대화 이어가기)
```

---

## 로컬 개발

### 1. 백엔드 실행

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # OPENAI_API_KEY 설정
uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

### 2. 프론트엔드 실행

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_BASE_URL=http://localhost:5000
npm run dev
```

브라우저에서 http://localhost:3000 접속

---

## 앱인토스 배포 준비

### 1. 콘솔 등록
[앱인토스 개발자센터](https://developers-apps-in-toss.toss.im/)에서 파트너 등록

### 2. SDK 설치
```bash
cd frontend
npm install @apps-in-toss/web-framework
npx ait init   # granite.config.ts 재생성
```

### 3. granite.config.ts 활성화
`granite.config.ts`의 주석 처리된 코드를 활성화하고 앱 이름 설정

### 4. 빌드 및 업로드
```bash
npm run build   # dist/ 폴더 생성
npx ait build   # .ait 파일 생성
```
앱인토스 콘솔에서 `.ait` 파일 업로드 → 검수 제출

---

## 캐릭터

| 캐릭터 | 성격 | 언어 |
|---|---|---|
| 루시앙 보스 | 냉정한 점성술사 | 한국어/영어/중국어/태국어 |
| 이졸데 하르트만 | 시적인 예언자 | |
| 청운 선인 | 사유적인 도사 | |
| 린화 | 장난스러운 점쟁이 | |
| 팀블 오크루트 | 따뜻한 자연주의자 | |

---

## 환경 변수

| 변수 | 설명 |
|---|---|
| `OPENAI_API_KEY` | OpenAI API 키 (백엔드) |
| `VITE_API_BASE_URL` | 백엔드 URL (프론트엔드) |
