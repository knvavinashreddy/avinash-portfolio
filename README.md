# Avinash Reddy Konala · Portfolio

A playful portfolio built with React + Vite: an illustrated Bhimavaram → Hyderabad landscape with a Day/Night switch, a journey timeline, a pick-a-card project deck, an interactive toolkit, coding ratings, a YouTube launch countdown, a draggable "off the clock" board, a notes wall, a built-in lo-fi record player, and keyboard shortcuts (M, G, L, Y, R).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## Edit your content

Almost everything lives in **`src/data.js`**:

| What | Where in `data.js` |
| --- | --- |
| Headline, intro, degree | `profile` |
| Email, GitHub, LinkedIn, YouTube, resume | `links` |
| Clickable places on the landscape | `places` |
| Journey map: nine stops, stories, years, pin positions, gallery photos | `journeyStops` |
| Projects, stats, repo and demo links | `projects` |
| Tools and what you use them for | `toolkit` |
| LeetCode / Codeforces / CodeChef | `ratings` |
| YouTube launch date | `youtube.launch` |
| Notes, ticket and photos on the board | `boardItems` |

Search the file for `PLACEHOLDER` to find every link you still need to replace.

**Your photo:** replace `src/assets/avinash.jpg` (square image works best).
**Resume:** put `resume.pdf` inside the `public/` folder.
**Board photos:** put images in `public/` and add `src: '/your-photo.jpg'` to a photo item in `boardItems`.

## Deploy to Vercel

1. Push this folder to a new GitHub repo.
2. On vercel.com, click **Add New → Project** and import the repo.
3. Vercel detects Vite automatically. Click **Deploy**.

## Make the notes wall public (optional MERN upgrade)

Right now notes are saved in each visitor's own browser (`localStorage`), so visitors don't see each other's notes. To make it a real shared wall:

1. Create a small Express API with two routes: `GET /api/notes` and `POST /api/notes`, storing notes in MongoDB Atlas.
2. In `src/components/Wall.jsx`, replace `load()` with a `fetch('/api/notes')` and the `setNotes` in `submit` with a `POST`.
3. Add basic rate limiting and a profanity check before notes go live.

The same API can also power a visitor counter.

## The journey map

`journeyStops` in `src/data.js` drives both the map preview and the full-screen map.

- **Photos:** put images in `public/photos/` and add `src: '/photos/name.jpg'` to a gallery item.
- **Highlights:** wrap words in `**double stars**` inside `story`.
- **Pin positions:** `pos` is a point on a 2400 × 1700 map. Bhimavaram is around x 1950, Tumakuru around x 550, Hyderabad around x 1250.
- **Controls:** scroll or arrow keys travel between stops, drag to look around, +/− to zoom, Esc to close.
