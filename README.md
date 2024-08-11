
# Firechat

## Overview

A simple real-time chat application built with Next.js, Firebase


## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/valentindush/firechat.git
   ```

2. Navigate to the project directory:
   ```
   cd firechat
   ```

3. Install dependencies:
   ```
   pnpm install
   ```
   or
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

4. Set up your Firebase configuration:
   - Create a new Firebase project
   - Enable Firestore and Authentication
   - Copy your Firebase config
   - Create a `.env.local` file in the root directory and add your Firebase config:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

5. Run the development server:
    ```
    pnpm dev
    ```
    or
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


## Acknowledgements

- Next.js
- Firebase
- NextUI
- Tailwind CSS
- React Icons
