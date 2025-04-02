# Email Flow Builder

Email Flow Builder is a tool to schedule and automate email workflows using a simple flowchart-based UI.

## Features
- Create email workflows visually
- Schedule email sending
- Store email configurations in MongoDB
- Backend using Express & MongoDB
- Frontend built with React

## Tech Stack
- **Frontend:** React, Netlify
- **Backend:** Node.js, Express, MongoDB Atlas, Agenda.js for job scheduling
- **Deployment:** Render (Backend), Netlify (Frontend)

## Installation

### Prerequisites
- Node.js installed
- MongoDB Atlas setup
- Git installed

### Clone the Repository
```sh
git clone https://github.com/samarth2812/email-flow-builder.git
cd email-flow-builder
```

### Setup Backend
```sh
cd server
npm install
```

#### Create a `.env` file inside `server/`
```sh
MONGO_URI=your_mongodb_connection_string
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

#### Run Backend
```sh
npm start
```

### Setup Frontend
```sh
cd ../client
npm install
```

#### Update API URL
In `client/src/config.js` (or similar file):
```js
const API_URL = "https://email-flow-builder.onrender.com/api/emails/save-flowchart";
```

#### Run Frontend
```sh
npm start
```

## Deployment

### Deploy Backend (Render)
1. Push code to GitHub.
2. Go to [Render](https://render.com/), create a new Web Service.
3. Select the backend repository.
4. Set Root Directory as `server`.
5. Use these commands:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
6. Add environment variables from `.env`.
7. Deploy the backend.

### Deploy Frontend (Netlify)
1. Push the frontend code to GitHub.
2. Go to [Netlify](https://www.netlify.com/) and create a new site.
3. Connect to the GitHub repository and select the frontend folder.
4. Set build settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `client/build`
5. Deploy the frontend.

## Changing Email Schedule Interval
For testing purposes, the email is scheduled every **1 minute** instead of **1 hour**. To change this:
1. Open `server/routes/emailRoutes.js`
2. Locate the following code:
   ```js
   await agenda.schedule("in 1 minute", "send email", {
       to: firstNode.data.to,
       subject: firstNode.data.subject,
       body: firstNode.data.body,
   });
   ```
3. Change **"in 1 minute"** to **"in 1 hour"**:
   ```js
   await agenda.schedule("in 1 hour", "send email", {
       to: firstNode.data.to,
       subject: firstNode.data.subject,
       body: firstNode.data.body,
   });
   ```
4. Restart the backend.

## Troubleshooting
### MongoDB Connection Error
- Ensure your IP is whitelisted in MongoDB Atlas.
- Verify `MONGO_URI` in `.env`.

### Cannot GET /
- Ensure backend is running and connected to MongoDB.
- Check if the frontend is pointing to the correct backend URL.

### Emails Not Sending
- Verify `EMAIL_USER` and `EMAIL_PASS` in `.env`.
- Check if the email service allows less secure apps.

## Contributing
Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---
🚀 Happy Coding!

