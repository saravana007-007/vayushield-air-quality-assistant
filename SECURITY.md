# VayuShield Security Policy

## Threat Model & Client-Side Design
VayuShield is an ambient air hazard mitigation and educational assistant designed for high-smog episodes.

### API Credentials & Data Protection
- **No Embedded Production Secrets**: VayuShield does not bake private master keys into public browser bundles. When using live Gemini AI capabilities, requests are made directly via user-provided keys or environment variables configured in hosting environments with appropriate origin protections.
- **Offline Safety Fallbacks**: If no Gemini API key is configured, VayuShield functions 100% offline using verified, physician-aligned fallback plans based on WHO and US EPA breakpoints.

### Content Security Policy (CSP)
A strict Content Security Policy is enforced in `vercel.json`:
- `default-src 'self'`
- `connect-src` restricted to trusted endpoints:
  - `https://air-quality-api.open-meteo.com` (Open-Meteo Air Quality)
  - `https://geocoding-api.open-meteo.com` (Open-Meteo Geocoding)
  - `https://generativelanguage.googleapis.com` (Google Gemini API)
- `X-Frame-Options: DENY` (prevents clickjacking)
- `X-Content-Type-Options: nosniff` (prevents MIME sniffing)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(self), microphone=(self)` (prevents iframe misuse)

### Input Sanitization & Abuse Prevention
- City search inputs are validated and sanitized to prevent injection attacks and directory traversals.
- Free-form text fields (Ask Vayu drawer and special medical conditions) are length-capped and stripped of executable control tags prior to inclusion in LLM prompt contexts.
- LocalStorage parsing incorporates schema checks and `try...catch` blocks to protect against poisoned or corrupted storage payloads.

### Reporting Vulnerabilities
If you discover a security issue or vulnerability in VayuShield, please report it via GitHub Issues or contact the maintainers directly.
