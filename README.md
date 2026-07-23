# PulseFit — Hybrid Fitness Tracker App

A hybrid mobile application built with **Ionic 8** and **Angular 19 (Standalone)**, powered by Capacitor. The application features daily metrics gauges, a workout activity logger, and dynamic analytics diagrams.

## Stack
- **Framework**: Angular 19 (Standalone component architecture)
- **Hybrid Shell**: Ionic 8 & Capacitor
- **Styling**: SCSS + Custom Glassmorphism Theme (Dark Mode default)
- **Persistence**: LocalDevice/Browser LocalStorage

## Setup
1. Open a terminal and navigate to the project directory:
   ```bash
   cd Build_37
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```

## Running Locally
- Run the local development server:
   ```bash
   npx ionic serve
   ```
   This will boot the app in your local web browser.

## Native Mobile Builds (Capacitor)
- Add native mobile project targets:
   ```bash
   npx cap add ios
   npx cap add android
   ```
- Sync builds assets:
   ```bash
   npm run build
   npx cap sync
   ```

## Running Tests
- Execute unit specs headlessly using Karma:
   ```bash
   npm run test
   ```

## Deployed
- **Vercel Production App**: [https://pulsefit-hybrid-tracker.vercel.app](https://pulsefit-hybrid-tracker.vercel.app)
- **GitHub Repository**: [https://github.com/breakingthebot/pulsefit-tracker](https://github.com/breakingthebot/pulsefit-tracker)

## Architecture Notes
PulseFit employs an **offline-first state management** design pattern:
* **Models (`src/app/models/workout.model.ts`)**: Formulates strict types for workout sessions and target metrics goals.
* **Services (`src/app/services/fitness.service.ts`)**: A centralized state-managing service exposed to components using RxJS `BehaviorSubject` streams. Daily metric totals are recalculated on steps addition, water intake logging, or workout entry.
* **Storage Sync**: Automatically serializes current states to `LocalStorage` on state mutations and hydrates the database on initialization.

## Data Handling & Privacy
- **Collection**: The app collects workout activity categories, durations, estimated calorie expenditures, water logs, and step counts.
- **Storage**: All logged information is stored **locally on the device** inside your browser's private `LocalStorage`.
- **Sharing**: No data is transmitted to external servers, APIs, or database hosts. It is fully sandboxed on your device.
