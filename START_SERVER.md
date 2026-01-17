# How to Start the Backend Server

## Quick Start

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Create .env file:**
   Create a file named `.env` in the `server` folder with:
   ```
   PORT=5000
   ONDEMAND_API_KEY=cJP3spu2jknHr9XWzGEatDgKH3F4u2pL
   ```

3. **Install dependencies (if not done):**
   ```bash
   npm install
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **You should see:**
   ```
   🚀 Jan Sahayak Server running on http://localhost:5000
   📝 API endpoint: http://localhost:5000/api/extract-aadhar
   ```

## Troubleshooting

- **Port 5000 already in use?** Change PORT in `.env` file
- **Module not found errors?** Run `npm install` again
- **API key errors?** Make sure your OnDemand API key is correct in `.env`

## Testing the Server

Once running, test with:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status":"ok","message":"Jan Sahayak Server is running"}
```
