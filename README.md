# Gym Tracker 🏋️

A simple and clean gym routine tracker app built with React. Track your daily workouts with persistent storage and automatic daily resets.

## Features

- **Add Routine**: Paste your gym schedule and let the app parse it automatically
- **Smart Parsing**: Detects day names automatically (Monday, Tuesday, etc.)
- **Daily Tracking**: Check off exercises as you complete them
- **One-Time Checks**: Once checked, exercises can't be unchecked for that day
- **Auto Reset**: Checkboxes reset every midnight automatically
- **Today's View**: Only shows exercises for the current day
- **Secure Reset**: Password-protected app reset (password: `Tanzeem`)
- **LocalStorage**: All data saved locally on your device

## Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/gym-tracker.git
   cd gym-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run dev server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## Usage

1. Open the app and click "Add Routine"
2. Paste your gym schedule:
   ```
   Monday
   Bench Press
   Squats
   Rows

   Tuesday
   Deadlifts
   Pull-ups
   Cardio
   ```
3. The app parses it and shows today's exercises
4. Check off exercises as you complete them
5. Click 🗿 to access the reset menu (password: `Tanzeem`)

## Tech Stack

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **LocalStorage**: Data persistence
- **CSS**: Styling (no frameworks)

## Project Structure

```
gym-tracker/
├── GymTracker.jsx      # Main tracker component
├── App.jsx             # App wrapper
├── main.jsx            # React entry point
├── index.html          # HTML template
├── index.css           # Global styles
├── App.css             # App styles
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Browser Support

Works on any modern browser with:
- React 18+ support
- LocalStorage API
- ES6+ JavaScript

## License

MIT

## Author

Tanzeem
