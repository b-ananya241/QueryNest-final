# QueryNest - Community Q&A Platform

A full-stack community Q&A platform built with React.js, Material-UI, and Firebase.

## Features

- **Authentication**: User registration and login with email/password
- **Questions**: Post questions with title and description
- **Real-time Updates**: Questions are stored in Firebase Realtime Database and displayed in real-time
- **Responsive Design**: Built with Material-UI for a modern, responsive interface

## Tech Stack

- **Frontend**: React.js with Material-UI
- **Backend**: Firebase (Authentication + Realtime Database)
- **Hosting**: Firebase Hosting 

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new Firebase project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider
4. Enable Realtime Database:
   - Go to Realtime Database
   - Create a database in test mode (you can change rules later)
5. Get your Firebase config:
   - Go to Project settings > General
   - Scroll down to "Your apps" section
   - Click "Add app" and select Web (</>)
   - Copy the config object

### 2. Local Development

1. Clone or download this repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Update Firebase configuration:
   - Open `src/firebase.js`
   - Replace the placeholder values with your actual Firebase config
5. Start the development server:
   ```bash
   npm start
   ```
6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── QuestionList.js    # Displays list of questions
│   │   └── AddQuestion.js     # Form to add new questions
│   ├── firebase.js            # Firebase configuration
│   ├── App.js                 # Main application component
│   └── index.js               # Application entry point
└── package.json
```

## Firebase Configuration

Make sure to update `frontend/src/firebase.js` with your actual Firebase project configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Deployment

### Firebase Hosting (Recommended)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login to Firebase:
   ```bash
   firebase login
   ```
3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select "Hosting"
   - Choose "frontend" as your public directory
   - Configure as a single-page app: Yes
4. Build the project:
   ```bash
   cd frontend
   npm run build
   ```
5. Deploy:
   ```bash
   firebase deploy
   ```

