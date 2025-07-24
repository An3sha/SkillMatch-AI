# 100B Jobs 🚀

An AI-powered hiring platform that helps recruiters **discover and shortlist candidates** in seconds using intelligent filtering, team building, and natural language search powered by OpenAI embeddings.

🔗 Live Demo: [https://100-bjobs.vercel.app](https://100-bjobs.vercel.app)

---

## ✨ Features

- 🔍 **Candidate Discovery** — Fast filtering by skills, location, salary, and experience
- 💬 **AI Assistant (RAG)** — Ask natural questions like “React developers with salary under 100k”
- ✅ **Team Builder** — Select up to 5 candidates and save up to 3 teams
- 🔐 **Google Auth** — Login via Supabase Auth
- ☁️ **Supabase DB** — All candidates, teams, and sessions stored in Supabase
- 🧠 **OpenAI Embeddings** — RAG pipeline over thousands of JSON candidate records
- ⚡️ **Deployed on Vercel**

---

## 🧱 Tech Stack

| Layer            | Technology                       |
|------------------|----------------------------------|
| Frontend         | React (Vite) + Tailwind CSS      |
| Backend / Auth   | Supabase (Postgres, Auth, pgvector) |
| AI + Embeddings  | OpenAI `text-embedding-3-small`  |
| Deployment       | Vercel                           |

---

## 💡 How It Works

### 1. Candidate Database
- Candidates are stored in Supabase `profiles` table.
- Each record includes: name, skills, location, work experience, education, salary expectation, and more.

### 2. Google Auth with Supabase
- On login, users are authenticated using Supabase Auth + Google OAuth.
- Logged-in users can build and persist teams (max 3) in a separate `teams` table.

### 3. AI Assistant with RAG

> The chatbot is not just GPT — it performs **vector-based retrieval over real candidate data**.

- Data is chunked into 5000 token-sized JSON chunks
- Embeddings are generated using OpenAI and stored in Supabase (`embedding vector(1536)`)
- On user query:
  - Query is embedded
  - A pgvector similarity search retrieves the top matching chunks
  - These are sent to OpenAI’s completion API along with a custom system prompt
  - The assistant returns summarized, structured answers formatted as cards

---

## 🛠️ Local Setup

### 1. Clone the Repo

```bash
git clone https://github.com/An3sha/100Bjobs
cd 100Bjobs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add `.env` File

Create a `.env` file in the root directory with the following:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=your-openai-key
VITE_RAG_PIPE_URL=https://your-api-url-if-separate
```

### 4. Run the App

```bash
npm run dev
```



