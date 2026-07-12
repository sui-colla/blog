# Verify this Next.js blog

Use this recipe to verify runtime behavior after product-source changes.

1. Build the production app:
   ```bash
   npm run build
   ```
2. Start on a non-default port to avoid colliding with a dev server:
   ```bash
   npm run start -- -p 3101
   ```
3. Drive the running app through HTTP surfaces:
   - `/`
   - `/posts/nextjs-guide`
   - `/tags`
   - `/archive`
   - `/sitemap.xml`
   - `/robots.txt`
   - `/feed.xml`
   - `/api/search-index`
   - `/api/og?slug=nextjs-guide`
4. For generated endpoints, capture status, content-type, and a small response sample. The OG endpoint should return `image/png` with PNG signature bytes `137,80,78,71,13,10,26,10`.
5. Add at least one probe. Useful probes:
   - `POST /api/search-index` should return `405`.
   - A missing post slug should return the app 404.

Gotchas:
- If port `3101` is occupied, pick another high port.
- `next start` serves the last production build, so rebuild after source changes before runtime verification.
