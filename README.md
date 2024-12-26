# MyTube

MyTube is a YouTube clone built with React, TypeScript, and Vite. It provides a minimal setup to get React working with Vite, including HMR (Hot Module Replacement) and some ESLint rules.

## Features

-   Video listing and playback
-   Shorts listing and playback
-   Search functionality
-   Responsive design
-   Caching for improved performance

## Project Structure

```
src/
    api/
        ytApi.ts
    assets/
    components/
        BasicLayout.tsx
        Header.tsx
        ShortCard.tsx
        Sidebar.tsx
        VideoCard.tsx
    pages/
        Home.tsx
        ShortDetail.tsx
        VideoDetail.tsx
        Videos.tsx
    types/
        index.ts
    index.css
    main.tsx
    vite-env.d.ts
```

## Getting Started

### Prerequisites

-   Node.js
-   npm

### Installation

1. Clone the repository:

```sh
git clone https://github.com/your-username/mytube.git
cd mytube
```

2. Install dependencies:

```sh
npm install
```

3. Start the development server:

```sh
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`.

### Building for Production

To build the project for production, run:

```sh
npm run build
```

### Linting

To lint the project, run:

```sh
npm run lint
```

## Configuration

### ESLint

The project uses ESLint for linting. The configuration can be found in `eslint.config.js`.

### Tailwind CSS

The project uses Tailwind CSS for styling. The configuration can be found in `tailwind.config.js`.

## API

The project uses a custom API client to fetch data from YouTube. The API client is defined in `src/api/ytApi.ts`.

## Components

### BasicLayout

The `BasicLayout` component provides a basic layout with a header and a content area.

### Header

The `Header` component includes a search bar and user actions.

### Sidebar

The `Sidebar` component provides navigation links.

### VideoCard

The `VideoCard` component displays a video thumbnail and details.

### ShortCard

The `ShortCard` component displays a short video thumbnail and details.

## Pages

### Home

The `Home` page displays a list of videos and shorts.

### VideoDetail

The `VideoDetail` page displays the details of a selected video.

### ShortDetail

The `ShortDetail` page displays the details of a selected short video.

### Videos

The `Videos` page displays search results.

## Types

The project defines TypeScript types in `src/types/index.ts`.

## License

This project is licensed under the MIT License.
