# AI 타로오빠 - 백엔드 (FastAPI)

## 로컬 실행

```bash
pip install -r requirements.txt
OPENAI_API_KEY=sk-... uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

## Railway 배포

1. [Railway.app](https://railway.app) 접속 → New Project → Deploy from GitHub
2. 이 레포의 `backend/` 폴더 연결
3. Environment Variables에 `OPENAI_API_KEY` 추가
4. 배포 후 도메인을 프론트엔드 `VITE_API_BASE_URL`에 설정

## API 엔드포인트

- `POST /api/tarot` - 타로 리딩
- `POST /api/tarot/followup` - 추가질문
- `GET /health` - 헬스체크
