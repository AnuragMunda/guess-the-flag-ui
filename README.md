# 🌍 Guess The Flag

> A real-time multiplayer flag guessing game built with Next.js 14 App Router and Ably.

## 🎮 Overview

**Flag Tastic Faceoff** is a fast-paced 1v1 geography trivia game where players compete to identify world flags in real-time. Featuring Ably-powered communication, smooth UI, and a competitive scoring system, it’s designed to test your flag knowledge and reflexes.

- 🧠 Identify country flags
- ⚡ Fast answers get more points
- 🧍 1v1 multiplayer matchups
- 🔄 Real-time updates using Ably Pub/Sub
- 🥇 Leaderboard & match result summary

---

## 🧪 Tech Stack

| Layer        | Tech                          |
|--------------|-------------------------------|
| Frontend     | Next.js 14 (App Router)       |
| State        | React Hooks, Context API      |
| Real-time    | Ably Realtime Messaging       |
| Assets       | Country flags from `/public`  |
| Hosting      | Vercel                        |

---

## 🚀 Features

- Matchmaking via lobby room
- Real-time round-by-round gameplay
- Scoring logic with feedback
  - ✅ +10 points for first correct
  - ✅ +7 for correct (not first)
  - ❌ 0 for wrong
  - ⏰ 0 if unanswered
- Leader/host logic for progressing rounds
- Flag display with 4 multiple-choice options
- Match summary screen with winners and rewards

---

## 🖥️ Project Structure

```
/app
  /play            → Game page
  /results         → Match result page
/components        → Shared UI components
/context/ably-provider.tsx → Ably context
/public/flags      → Country flags SVGs
/assets/countries.json → Country metadata
```

---

## 🛠️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/flag-tastic-faceoff.git
cd flag-tastic-faceoff
```

### 2. Install dependencies

```bash
npm install
# or
yarn
```

### 3. Set up Ably

Create a `.env.local` file:

```
NEXT_PUBLIC_ABLY_API_KEY=your-ably-public-api-key
```

> 🔐 Make sure to only expose the public Ably API key (`[appId].[publicKey]` format)

### 4. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🧠 Scoring Rules

| Action              | Points |
|---------------------|--------|
| First correct       | +10    |
| Correct (not first) | +7     |
| Wrong answer        | 0      |
| No answer (timeout) | 0      |

---

## 📦 Deployment

You can easily deploy this app on [Vercel](https://vercel.com/) since it's a Next.js 14 App Router project.

1. Push your repo to GitHub
2. Connect to Vercel
3. Set environment variable:
   - `NEXT_PUBLIC_ABLY_API_KEY`

---

## 🧩 Credits

- Country flags: [Flagpedia](https://flagpedia.net/download/api)
- Real-time messaging: [Ably](https://ably.com/)
- Built with ❤️ using React & Next.js

---

## 📜 License

MIT License — Feel free to use, modify, and deploy.