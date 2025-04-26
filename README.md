# PWAs practice

## OVERVIEW

This document outlines the estimation plan for implementation of Progressive Web App project to build a mobile application. The practice focuses on understanding and applying the PWA for mobile development.

## OBJECTIVES

- Gain an understanding of core concepts of PWAs and aim to deliver an app-like experience.
- Understand the role of Service Worker
- Understand and Utilize the Web App manifest
- Implement Offline Capabilities

## TECHNICAL STACKS

- [React](https://react.dev)(v19): React lets you build user interfaces out of individual pieces called components. Create your own React components like Thumbnail, LikeButton, and Video.
- [React Router](https://reactrouter.com/home#react-router-home)(v7.5.0): React Router is a multi-strategy router for React bridging the gap
- [Vite PWA](https://vite-pwa-org.netlify.app)(v0.21.1): PWA integrations for Vite and the ecosystem
- [Tailwind CSS](http://tailwindcss.com)(v4.1.3): Rapidly build modern websites without ever leaving your HTML
- [Open-Meteo Weather API](https://open-meteo.com/): Open-Meteo is an open-source weather API and offers free access for non-commercial use. No API key required.

## APPROACHES

- Have app icon & splash screen
- App still work even app is offline
  - Leverage IndexedDB API to store the current weather forecast data to show
- Show an alert to let user know the current network status
- Auto detect the user’s location
  - Leverage Permission API to request user permission to get the user’s location data
- The user can search location
  - Allow the user to search specific location
- Let user the future attention weather forecast by push notification
  - Leverage Push Notification API to create a push notification to user know the future weather forecast

## DESIGN

[Figma](https://www.figma.com/design/Ako0rWzBakKJgzhHv3oPmW/Mono-Weather-UI?node-id=19-2&t=3TQb0PNtktLOKKSl-1)

## DIRECTORY STRUCTURE

```
├── node_modules/
├── public/
└── src/
    │   └── weather-icons/
    ├── assets/
    ├── components/
    │   ├── commons/
    │   │   ├── Button/
    │   │   ├── Input/
    │   │   └── Text/
    │   ├── Banner/
    │   ├── Button/
    │   ├── CollectionCards/
    │   ├── Loading/
    │   ├── MessagePopup/
    │   ├── MusicController/
    │   ├── Navigation/
    │   ├── RowCards/
    │   ├── Song/
    │   └── Typography/
    ├── constants/
    ├── hooks/
    ├── layouts/
    ├── models/
    ├── screens/
    ├── services/
    ├── stores/
    └── utils/
```

## GETTING STARTED

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18.0.0 or later)
- PNPM 9.15.5
- Git

### Step-by-Step Setup

1. Clone the repository

```shell
git clone git@github.com:vantran-agilityio/weather-forecast.git
cd pwa-training
```

2. Install dependencies

```shell
pnpm install
```

3. Set up environment variables
   Create a `.env` file in the root directory with the following content:

```
VITE_OPENWEATHER_API_KEY=f593f86e24c321b810290a90d06930db
VITE_METEO_API_URL='https://api.open-meteo.com/v1'
VITE_OPENWEATHER_API_URL='https://api.openweathermap.org/data/2.5'
VITE_OPENWEATHER_GEO_API_URL='https://api.openweathermap.org/geo/1.0'
```

4. Start the development server

```shell
pnpm dev
```

5. Build for production

```shell
pnpm build
```

6. Preview the production build

```shell
pnpm preview
```

## Author

[Van Tran](mailto:van.tran@asnet.com.vn)
