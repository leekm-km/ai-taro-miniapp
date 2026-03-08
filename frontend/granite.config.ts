/**
 * 앱인토스(Apps in Toss) 설정 파일
 *
 * 콘솔 등록 후 @apps-in-toss/web-framework 설치 시 활성화:
 *   npm install @apps-in-toss/web-framework
 *   npx ait init
 *
 * 설치 후 아래 주석을 해제하고 사용하세요.
 */

// import { defineConfig } from '@apps-in-toss/web-framework/config'
// import { appsInToss } from '@apps-in-toss/web-framework/plugins'
//
// export default defineConfig({
//   appName: 'ai-taro-oppa',
//   plugins: [
//     appsInToss({
//       brand: {
//         displayName: 'AI 타로오빠',
//         primaryColor: '#6d235c',
//         bridgeColorMode: 'dark',
//       },
//     }),
//   ],
//   build: {
//     outDir: 'dist',
//     command: 'npm run build',
//   },
//   dev: {
//     port: 3000,
//     command: 'npm run dev',
//   },
// })

export default {
  appName: 'ai-taro-oppa',
  displayName: 'AI 타로오빠',
  primaryColor: '#6d235c',
}
