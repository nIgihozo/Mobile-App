# Movie App

A mobile application built with React Native and Expo SDK that fetches and displays real-time movie and TV show data using The Movie Database (TMDB) API. The project features Firebase authentication, data caching, and user history tracking.

## Features

- **Trending Content:** Displays the latest trending movies and TV shows globally.
- **Categorized Discovery:** Explore dedicated sections for Korean TV shows, Disney movies, and more.
- **Search Functionality:** Multi-search capabilities across movies, TV series, and production credits.
- **Media Trailers:** Seamlessly fetches official YouTube trailers and teasers for selected titles.
- **User Activity History:** Securely logs user interactions and history using Firebase Firestore.

## Tech Stack

- **Framework:** React Native (Expo SDK)
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Backend Services:** Firebase (Auth & Firestore)
- **API Provider:** TMDB (The Movie Database) API

---

## Getting Started

### Prerequisites

Ensure you have Node.js and the Expo Go app (or an emulator) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/nIgihozo/Mobile-App.git](https://github.com/nIgihozo/Mobile-App.git)
   cd Mobile-App

   Install dependencies:

Bash
npm install
Set up Environment Variables:
Create a .env file in the root directory of the project and add your TMDB Read Access Token:

Code snippet
TMDB_TOKEN=your_tmdb_bearer_token_here
(Note: The .env file is kept local and excluded from version control for security.)

Running the Application
Start the Expo development server:

Bash
npx expo start
Scan the QR code with your Expo Go app (Android) or Camera app (iOS) to run it on your device.

Press a for Android Emulator or i for iOS Simulator if running locally.

Project Structure
Plaintext
├── assets/               # Local static images, icons, and splash screens
├── src/
│   ├── config/           # Firebase configuration and initialization
│   ├── navigators/       # React Navigation setup (Tab/Stack navigators)
│   ├── redux/            # Redux store and slice configurations
│   ├── screen/           # Component layouts for application views
│   └── service/          # API integration and endpoints (movieApi.ts)
├── app.config.js         # Dynamic Expo configuration loading environment variables
├── .env                  # Local secret environment variables (ignored by Git)
└── README.md             # Project documentation
Security Note
This project utilizes app.config.js paired with expo-constants to securely inject server-side credentials at runtime. Never commit .env configurations containing production keys to public repositories.
