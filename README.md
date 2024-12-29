# Feature Brainstorming Tool

A modern web application for organizing and managing project features with drag-and-drop functionality, dependency visualization, and categorization.

## Features

- Create and manage projects
- Organize features into categories (Essential, Nice-to-Have, Future)
- Drag-and-drop interface for feature organization
- Dependency visualization
- Export features as Markdown
- Modern, responsive UI

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Flow
- Zustand for state management

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/itcambridge/IdiomMonkey.git
cd IdiomMonkey
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Docker Deployment

1. Build the Docker image:
```bash
docker-compose build
```

2. Start the container:
```bash
docker-compose up -d
```

The application will be available at http://localhost:80

## Project Structure

- `/src/components` - React components
- `/src/pages` - Page components
- `/src/store` - State management
- `/src/types` - TypeScript types
- `/src/utils` - Utility functions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
