# PWA practice

## OVERVIEW

This document outlines the estimation plan for implementation of Progressive Web App project to build a mobile application. The practice focuses on understanding and applying the PWA for mobile development.

## OBJECTIVES

- Gain an understanding of core concepts of PWAs and aim to deliver an app-like experience.
- Understand the role of Service Worker
- Understand and Utilize the Web App manifest
- Implement Offline Capabilities

## TECHNICAL STACKS

- React: React lets you build user interfaces out of individual pieces called components. Create your own React components like Thumbnail, LikeButton, and Video.
- Vite PWA: PWA integrations for Vite and the ecosystem
- Tailwind CSS: Rapidly build modern websites without ever leaving your HTML
- TanStack Query(React Query): TanStack Query is configurable down to each observer instance of a query with knobs and options to fit every use-case.
- Open-Meteo Weather API: Open-Meteo is an open-source weather API and offers free access for non-commercial use. No API key required.

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

## STRUCTURE

(Update during developing)
