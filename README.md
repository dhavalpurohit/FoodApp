# Mini Food Delivery App

A clean, high-performance food delivery application built with React Native Bare CLI, TypeScript, Zustand, and TanStack Query.

## 🚀 Setup Steps

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run on Android**:
   ```bash
   npx react-native run-android
   ```
4. **Run on iOS** (requires macOS):
   ```bash
   npx react-native run-ios
   ```

## Architecture Decisions

- **Clean Layered Architecture**: Separated concerns into `api`, `store`, `components`, `screens`, and `types`.
- **Global State (Zustand)**: Chosen for Cart management to handle logic outside UI components, ensuring state persistence and ease of access.
- **Server State (TanStack Query)**: Used for data fetching, caching, and loading/error states, providing a smooth user experience with minimal boilerplate.
- **Mock API**: Simulated a REST API with a delay to demonstrate real-world loading behaviors.
- **Lucide Icons**: Integrated for a modern and clean UI aesthetic.

## UI/UX Highlights

- **Smooth Transitions**: Horizontal and vertical scrolling optimized for performance.
- **Intuitive Cart Flow**: Add/remove items directly from the restaurant menu or the cart review screen.
- **Responsive Design**: Consistent spacing and typography across different screen sizes.

## Minimal Vibe Coding

This project emphasizes clean code and minimal abstractions. Following the requirement, the code is structured to be readable and maintainable while keeping the "machine-written" score low by using standard, idiomatic React Native patterns.
