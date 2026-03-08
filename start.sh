#!/bin/bash
# AI 타로오빠 로컬 개발 서버 시작 스크립트

echo "🔮 AI 타로오빠 미니앱 시작..."
echo ""

# 백엔드 .env 확인
if ! grep -q "OPENAI_API_KEY=sk-" backend/.env 2>/dev/null; then
  echo "⚠️  backend/.env 에 OPENAI_API_KEY를 설정해주세요"
  echo "   파일 위치: $(pwd)/backend/.env"
  echo ""
fi

# 백엔드 실행 (백그라운드)
echo "📡 백엔드 시작 (port 5000)..."
cd backend && uvicorn main:app --reload --port 5000 &
BACKEND_PID=$!
cd ..

# 백엔드 준비 대기
sleep 2

# 프론트엔드 실행
echo "💻 프론트엔드 시작 (port 3000)..."
cd frontend && npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ 실행 중!"
echo "   프론트엔드: http://localhost:3000"
echo "   백엔드:     http://localhost:5000"
echo ""
echo "종료: Ctrl+C"

# 둘 다 종료 처리
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
