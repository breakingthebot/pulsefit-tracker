# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-07-22

### Added
- Created `Tab2Page` Workout Logger and History List interface.
- Built a Reactive Form using `FormBuilder` with fields for Activity Type, Custom Name, Duration (minutes), Calories Burned (kcal), and optional Notes.
- Integrated validations preventing entry of negative durations/calories or blank custom activities.
- Constructed a chronological workout history list displaying individual session details (activities, category color badges, duration and calories icons).
- Added both sliding-to-delete options (standard on iOS/Android) and clickable direct delete buttons.
- Wrote 5 new unit specs testing validation scopes and service logging dispatches.

## [0.2.0] - 2026-07-22

### Added
- Created `Tab1Page` daily goals metrics dashboard.
- Integrated animated circular SVG progress rings for steps, active time, and calorie burns.
- Created interactive water log card widget with positive/negative increment buttons and wave progress heights.
- Added steps simulation controls allowing users to add steps in 1k and 5k blocks.
- Configured headless Chrome testing script in `package.json`.
- Wrote unit specs verifying progress ring calculations and water widgets.

## [0.1.0] - 2026-07-21

### Added
- Bootstrapped Ionic + Angular Standalone application inside directory `Build_37`.
- Configured local repositories standards and Git logs structure.
