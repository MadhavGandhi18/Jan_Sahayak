# Restart the Backend Server

The server code has been updated to handle sessionId errors better. You need to restart the server:

## Steps:

1. **Stop the current server:**
   - Find the terminal where the server is running
   - Press `Ctrl + C` to stop it

2. **Restart the server:**
   ```bash
   cd server
   npm start
   ```

3. **You should see:**
   ```
   🚀 Jan Sahayak Server running on http://localhost:5000
   📝 API endpoint: http://localhost:5000/api/extract-aadhar
   ```

## What Changed:

- Server now tries without sessionId first
- If OnDemand API requires sessionId, it will retry with a generated one
- Better error messages if sessionId is still invalid

## Note:

If you continue to get "invalid session id" errors, the OnDemand API might require:
1. Creating a session first through their platform
2. Using a valid sessionId from your OnDemand account
3. Checking your API key permissions

Try uploading an Aadhar card again after restarting the server.
