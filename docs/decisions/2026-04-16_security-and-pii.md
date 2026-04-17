# 2026-04-16 — Security and PII compliance

## What was decided

### PII handling
Resumes contain sensitive PII: full name, email, phone, employment history, location.
- Resume files are processed server-side in the `/api/parse` endpoint and immediately discarded — never logged, never persisted
- Parsed `CareerEntry[]` is returned to the client and stored only in the user's own `localStorage`
- Server retains zero user data between requests
- Add a plain-language privacy notice in the UI: "Your resume is processed on our server to extract structure. We never store it."

### File upload security
- Validate both file extension AND mime type on the server before processing (PDF: `application/pdf`, DOCX: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`)
- Hard file size limit: 5MB
- Never execute content from uploaded files — parse text only
- Serverless function processes files in isolation — no persistent state between requests

### Content Security Policy
- Set strict `Content-Security-Policy` headers to mitigate XSS — protects `localStorage` career data from script injection
- Applied via Vercel response headers config

### Rate limiting
- Per-IP rate limit on `/api/parse` to prevent abuse
- Vercel provides baseline DDoS protection; add application-level limit (e.g. 10 requests/minute/IP)

### No auth surface
- No user accounts, no passwords, no sessions — no auth attack surface by design
- localStorage is device-local — no user database to breach

### Compliance posture
- GDPR/CCPA: no personal data stored server-side = minimal compliance burden. Add privacy notice and "clear my data" button (clears localStorage) for good faith compliance.
- No cookies beyond what Vercel sets by default
- No analytics or tracking without explicit user consent

## Why
Free public tool that processes resumes = PII by definition. "No storage" architecture is both the simplest implementation and the strongest privacy posture.

## Alternatives considered
- Storing parsed results server-side for cross-device access: rejected — adds database, auth, and significant compliance scope
- Client-side-only parsing (no serverless): considered but rejected — PDF/DOCX parsing libraries are too heavy for the browser bundle and quality is lower

## Trade-offs accepted
- Users lose data if they clear localStorage or switch devices. Accepted for v1 — the privacy benefit outweighs the convenience cost.
- No server-side analytics on parse quality. Accepted — we can add opt-in feedback later.
