# Moments to Frames Studio

Photography studio website for a boutique maternity and family portrait studio in Barrhaven, Ottawa. Monolithic Node.js/Express app serving a vanilla HTML/CSS/JS frontend with an AI chatbot assistant ("Maya") powered by Google Gemini.

Production domain: `momentstoframesstudio.com`

## Quick Start

```bash
cd backend
npm install
# Create .env with required variables (see below)
npm start
```

Server runs on `http://localhost:3000` by default. The Express server serves both the static frontend and the chat API.

## Environment Variables

Create `backend/.env` (gitignored):

```
GEMINI_API_KEY=<Google Gemini API key>
PORT=3000
```

The server starts without `GEMINI_API_KEY` but the chatbot endpoint will return errors.

## Project Structure

```
/
├── backend/
│   ├── server.js              # Express server: static file serving + /api/chat endpoint
│   ├── package.json           # Dependencies and start script
│   ├── .env                   # Environment variables (gitignored)
│   └── public/                # Static frontend (served by Express)
│       ├── index.html         # Homepage - hero slider, services, testimonials, map
│       ├── maternity-portfolio.html  # Masonry photo gallery page
│       ├── blog.html          # Blog page
│       ├── styles.css         # All site styling (CSS custom properties, responsive)
│       ├── main.js            # Site interactivity: nav, hero slider, testimonials, scroll animations
│       ├── chatbot.js         # AI chatbot widget: UI injection, Gemini API integration
│       ├── chatbot.css        # Chatbot-specific styles
│       └── images/            # All photo assets
├── chatinstruction.md         # Chatbot knowledge base (pricing, policies, services)
├── master.md                  # Design specification for rebuilding the site
└── .gitignore
```

## Architecture

- **Monolithic Express app**: `server.js` serves static files from `public/` and exposes one API route (`POST /api/chat`). No build step, no bundler, no framework.
- **CommonJS modules**: Backend uses `require()`. `"type": "commonjs"` in package.json.
- **AI chatbot**: `chatbot.js` sends messages to `/api/chat`, which forwards them to Google Gemini (`gemini-2.5-flash`) with a system prompt containing studio policies. Conversation history is maintained client-side (capped at 10 messages).
- **No build pipeline**: Frontend files are plain HTML/CSS/JS. CSS uses cache-buster query params (e.g., `styles.css?v=1.1`).
- **CORS**: Configured for `momentstoframesstudio.com`, `www.momentstoframesstudio.com`, `localhost:8080`, and `127.0.0.1:8080`.

## Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Express server, Gemini AI init, `/api/chat` endpoint with system prompt |
| `backend/public/chatbot.js` | Self-contained chatbot widget (IIFE). Injects UI into DOM, manages conversation state |
| `backend/public/main.js` | Page interactivity: mobile nav, sticky header, hero slider, testimonials, scroll animations |
| `backend/public/styles.css` | Complete site styles. Design system defined in `:root` custom properties |
| `chatinstruction.md` | Source of truth for chatbot responses: pricing, policies, services, delivery process |
| `master.md` | Full design spec for recreating the website from scratch |

## API

**POST /api/chat**
- Body: `{ "message": "string", "conversationHistory": [{ "role": "user"|"assistant", "content": "string" }] }`
- Response: `{ "reply": "string" }`
- Replies may contain HTML (links, lists) rendered by the chatbot via `innerHTML`.

## Code Style

**JavaScript (backend):** CommonJS `require()`, `const` by default, 4-space indentation, single quotes, async/await, try/catch around API calls, `console.log`/`console.error` for logging.

**JavaScript (frontend):** Vanilla JS only, IIFE pattern for chatbot to avoid globals, `DOMContentLoaded` wrapper in main.js, `document.querySelector` for DOM access, template literals for HTML construction, CSS class toggling for state.

**CSS:** Custom properties in `:root` (`--color-*`, `--font-*`, `--spacing-*`, `--transition-*` in main; `--chat-*` in chatbot). Mobile-first responsive with `@media` breakpoints. `transition: 0.3s ease` as default.

**HTML:** All pages include Meta Pixel tracking in `<head>`, Google Fonts via `<link>` with `preconnect`, and load `chatbot.js` before `</body>`.

**Git:** Conventional commits: `feat:`, `fix:`, `style:`, `refactor:`.

## Development Notes

- No tests, linter, or CI/CD. Keep it simple.
- The chatbot system prompt in `server.js` is hardcoded and derived from `chatinstruction.md`. If chatbot knowledge changes, update both.
- When adding new HTML pages, include: Meta Pixel script, Google Fonts links, `styles.css`, `chatbot.css`, and `chatbot.js`.
- Bump the `styles.css` version query param after CSS changes to bust Hostinger's cache.
- Images in `public/images/` are served directly with no optimization pipeline.
