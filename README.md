# Weather Dashboard

A modern weather dashboard application built with Angular that allows users to track weather conditions for multiple cities. The application features a clean, responsive design and real-time weather updates.

## Features

- Search and add multiple cities to track
- Real-time weather information including:
  - Temperature
  - Weather conditions
  - Weather descriptions
  - Last update time
- Responsive grid layout
- Toast notifications for user feedback
- Tooltip support for enhanced UX
- Multi-language support (EN/ID)

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   └── layout/                 # Main layout component
│   ├── featured/
│   │   └── weather-dashboard/      # Weather dashboard feature module
│   │       ├── component/          # UI components
│   │       │   ├── weather-card/   # Individual weather card
│   │       │   ├── weather-page/   # Main dashboard page
│   │       │   └── weather-search/ # City search component
│   │       ├── models/            # TypeScript interfaces
│   │       ├── services/          # API and business logic
│   │       └── state/             # State management
│   └── shared/                    # Shared components and utilities
│       ├── components/
│       │   ├── button/           # Reusable button component
│       │   ├── button-icon/      # Icon button component
│       │   ├── search-input/     # Search input component
│       │   └── toast-notification/ # Toast notification system
│       └── directives/
│           └── tooltip/          # Custom tooltip directive
```

## State Management

The application uses Akita for state management with the following structure:

- `WeatherStore`: Manages the application state
- `WeatherQuery`: Provides selectors for accessing state
- State includes:
  - Cities array
  - Loading state
  - Error handling

## Key Components

### Weather Page Component
- Main container component
- Manages the grid layout
- Handles city list display
- Integrates search functionality

### Weather Search Component
- City search functionality
- Form validation
- API integration for city lookup
- Error handling with toast notifications

### Weather Card Component
- Displays individual city weather
- Shows temperature, conditions, and description
- Includes refresh and remove functionality
- Responsive design

## Development

### Prerequisites
- Node.js (v14 or higher)
- Angular CLI (v19.2.3)

### Installation
```bash
npm install
```

### Running the Application
```bash
ng serve
```
Navigate to `http://localhost:4200/`

### Testing
```bash
ng test
```

## API Integration

The application integrates with weather APIs to fetch:
- City coordinates
- Current weather conditions
- Weather updates

## Styling

- Uses Tailwind CSS for styling
- Responsive design
- Dark/light mode support
- Custom animations for better UX

## Internationalization

- Supports multiple languages (EN/ID)
- Easy to add new languages
- Uses ngx-translate for translations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
