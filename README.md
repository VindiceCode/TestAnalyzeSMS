# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# SMS Analysis Dashboard

This project is a React-based dashboard for analyzing SMS responses. It allows users to generate sample responses, classify them, and compare the results between a current system and an AI model.

![Image Description](https://drive.google.com/uc?export=view&id=19Q8_k70bNPLlCsQ4ILRTsjY-F-e8n9aH)


## Features

- Response generator with adjustable parameters
- Classification of responses using both current and AI systems
- Visualization of classification results using charts
- Performance comparison between current and AI systems

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installing SMS Analysis Dashboard

To install the SMS Analysis Dashboard, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/TestAnalyzeSMS.git
   ```
2. Navigate to the project directory:
   ```
   cd TestAnalyzeSMS
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Using SMS Analysis Dashboard

To use SMS Analysis Dashboard, follow these steps:

1. Start the development server:
   ```
   npm run dev
   ```
2. Open your web browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

3. Use the interface to generate responses, add them to the list, and analyze them.

## Building for Production

To build the app for production, run:

```
npm run build
```

This will create a `dist` folder with your compiled assets, ready for deployment.

## Linting

To lint your code, run:

```
npm run lint
```

This will check your JavaScript and JSX files for potential errors and style issues.
