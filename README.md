# Reminder App (React Native)

A cross-platform mobile reminder application that allows users to create, edit, and manage reminders with scheduled notifications.

The app is designed as a local-first, single-user application with no backend dependency. All reminder data is stored persistently on the device, and time-based notifications are scheduled using the device notification system.

Tech Stack: React Native, Expo, JavaScript (ES6+), AsyncStorage, Expo Notifications

Features:
- Create, edit, and delete reminders
- Persistent local storage using AsyncStorage
- Time-based notification scheduling
- State-driven UI updates using React hooks
- Modular component structure for maintainability

How It Works:
- Reminders are stored locally on the device using AsyncStorage
- Application state is synchronized with stored data on app launch
- Notifications are scheduled based on reminder date and time
- Editing a reminder updates both local storage and scheduled notifications

Status:
This project is a functional prototype focused on core reminder logic and notification handling. It is structured for easy extension with features such as categories, recurring reminders, or cloud sync.

Note:
This is a local-only application with no backend, authentication, or network communication.
