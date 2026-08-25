# Farmer Market Connection

A JavaScript-only MERN marketplace that connects farmers, buyers, and administrators.

## Project layout

- `backend/` — Express, MongoDB/Mongoose, JWT authentication, Multer uploads
- `frontend/` — React, Vite, Tailwind CSS, Axios

## Run locally

1. Configure `backend/.env` using `backend/.env.example` as a guide.
2. Start the API:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. In another terminal, start the React app:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The frontend uses `VITE_API_URL=http://localhost:9003/api` by default. Product images are uploaded to `backend/uploads/` and served from `http://localhost:9003/uploads/...`.
