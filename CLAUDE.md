@docs/skills/apps-in-toss.md
@docs/skills/tds-mobile.md

### 모든 코드를 작성할 땐 코드 파일 최상단에 아래 문구를 주석으로 추가해주세요.
작성자 : 박현일
이 코드의 소유권은 작성자에게 있으며 아래 코드의 일부 또는 전체는 AI(Claude, Gemini)를 활용하여 작성되었습니다.

Author: Hyunil Park
Ownership of this code belongs to the author, and some or all of the code below has been written using AI (Claude, Gemini).

## Project Overview

**Today's Detective (Apps-in-Toss edition)** — 원본 Next.js 프로젝트(`../todays-detective`)를 앱인토스(Granite + TDS) 환경으로 마이그레이션한 버전입니다.

## Stack
- `@apps-in-toss/web-framework` (Granite) + Vite + React 18
- `@toss/tds-mobile`, `@toss/tds-mobile-ait` (TDS)
- `@emotion/react` for custom styling
- Path alias: `@/*` → `./src/*`

## Backend Strategy
서버 사이드 로직(Gemini 호출, 시나리오 저장)은 기존 Next.js 프로젝트의 API Routes를 API-only로 재사용합니다.

## 관련 문서
- 마이그레이션 TODO: `../todays-detective/plan/appsintoss_migration_todo.md`
- Step 1 분석: `../todays-detective/plan/step1_analysis.md`
