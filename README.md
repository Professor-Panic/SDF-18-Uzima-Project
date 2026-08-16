# Uzima Wellness

A modern wellness dashboard built with **React 19** and **Vite**. Uzima provides a simple, client-side experience for managing appointments and medications, checking in on mental wellbeing, and discovering nearby healthcare facilities.

> **Note:** Uzima is a wellness and productivity helper, not a medical or clinical system. Its mental-health guidance is intentionally non-clinical and should not replace professional care.

## ✨ Features

### 📊 Dashboard

-   Overview of upcoming appointments and medications
    
-   Quick access to common wellness actions
    
-   Central navigation for the application's core features
    

### 📅 Appointment Management

-   View appointments in a calendar
    
-   Book new appointments
    
-   Update appointment status
    
-   Delete appointments
    
-   Client-side mock service layer for development
    

### 💊 Medication Management

-   Organize medications by time of day
    
-   Mark medications as taken
    
-   Add and remove medications
    
-   Low-stock alerts
    
-   Client-side mock service layer for development
    

### 🧠 Mental Health Companion

-   Guided wellbeing check-ins
    
-   Short, practical self-help suggestions
    
-   Simple client-side conversational experience
    
-   Basic crisis-related text detection
    

The mental-health companion is **not a clinical or diagnostic tool**. Any crisis-support functionality should be supplemented with vetted local emergency and professional resources before production use.

### 🗺️ Healthcare Service Map

-   Interactive map powered by Leaflet
    
-   Loads healthcare facility data from external GeoJSON
    
-   Displays facilities on a map
    
-   Configurable default map center and zoom
    

----------

## 🛠️ Tech Stack

Technology

Purpose

**React 19**

UI framework

**Vite**

Development server and build tooling

**React Router**

Client-side routing

**Leaflet**

Interactive maps

**react-datepicker**

Appointment calendar

**lucide-react**

UI icons

**GeoJSON**

Healthcare facility data

See `package.json` for the exact dependency versions.

----------

## 🚀 Getting Started

### Prerequisites

Make sure you have:

-   **Node.js 18+**
    
-   **npm** or **yarn**
    

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>

```

### 2. Install dependencies

Using npm:

```bash
npm install

```

Or using yarn:

```bash
yarn install

```

### 3. Start the development server

```bash
npm run dev

```

Vite will start the application locally and provide a URL in the terminal.

### 4. Build for production

```bash
npm run build

```

The production-ready files are generated in the `dist/` directory.

### 5. Preview the production build

```bash
npm run preview

```

### 6. Run linting

```bash
npm run lint

```

----------

## 📁 Project Structure

```text
.
├── index.html
├── package.json
├── src/
│   ├── main.jsx
│   ├── index.css
│   │
│   ├── Dashboard/
│   │   └── Dashboard.jsx
│   │
│   ├── Appointments/
│   │   ├── AddAppointmentForm.jsx
│   │   ├── AppointmentCalendar.jsx
│   │   ├── AppointmentCard.jsx
│   │   └── appointmentsService.js
│   │
│   ├── Medication/
│   │   └── medicationsService.js
│   │
│   ├── Chatbot/
│   │   └── MentalHealth.jsx
│   │
│   ├── Map/
│   │   └── Map.jsx
│   │
│   └── Sidebar/
│       └── Sidebar.jsx
│
└── ...

```

### Key files

-   `index.html` — HTML entry point
    
-   `src/main.jsx` — React entry point, router setup, and route definitions
    
-   `src/Dashboard/Dashboard.jsx` — Main dashboard
    
-   `src/Appointments/` — Appointment UI and mock service
    
-   `src/Medication/` — Medication UI and mock service
    
-   `src/Chatbot/MentalHealth.jsx` — Mental-health companion
    
-   `src/Map/Map.jsx` — Leaflet map and GeoJSON facility loader
    
-   `src/Sidebar/Sidebar.jsx` — Primary application navigation
    
-   `src/index.css` — Global styles
    

----------

## 🧭 Application Routes

The application currently includes the following routes:

Route

Description

`/`

Application landing/dashboard

`/dashboard`

Wellness dashboard

`/appointments`

Appointment management

`/map`

Healthcare service map

`/mental-health`

Mental-health companion

Routes are configured in `src/main.jsx`.

----------

## 🔌 Data & Services

Uzima currently uses **in-memory mock services** rather than a backend.

### Appointments

`src/Appointments/appointmentsService.js` provides mock appointment operations and uses `fakeDelay()` to simulate asynchronous API requests.

### Medications

`src/Medication/medicationsService.js` provides the equivalent mock functionality for medication data.

These services are intentionally structured so they can later be replaced with real API calls.

### Moving to a backend

When integrating a backend, consider:

1.  Replacing mock service functions with HTTP requests.
    
2.  Moving persistent data to a database.
    
3.  Adding authentication and authorization.
    
4.  Validating data on both client and server.
    
5.  Handling loading, error, and offline states.
    
6.  Replacing client-generated IDs with backend-generated IDs.
    

----------

## 🗺️ Map Data

The service map uses Leaflet and fetches healthcare facility data from an external GeoJSON endpoint.

The facility URL is configured through the `FACILITIES_URL` constant in:

```text
src/Map/Map.jsx

```

The default map center is approximately Nairobi:

```text
Latitude:  -1.28333
Longitude: 36.81667

```

To change the initial location or zoom level, update the corresponding Leaflet map configuration in `src/Map/Map.jsx`.

If the external GeoJSON service becomes unavailable, the map may not display facility data. For production deployments, consider using a reliable API or hosting the required dataset yourself.

----------

## 🧩 Customization

### Routing

Update `src/main.jsx` to add, remove, or modify application routes.

### Icons

The UI uses `lucide-react`. Icons can be replaced or extended without changing the application's overall architecture.

### Appointment Calendar

The appointment calendar is powered by `react-datepicker`. Its appearance and behavior can be customized through the component configuration and CSS.

### Mock IDs

The mock services generate IDs using a `Date.now()`-based approach with prefixes such as:

```text
apt_
med_

```

When connecting to a real backend, update the service layer to use the IDs returned by the API.

----------

## 🧠 Mental Health & Safety

Uzima's mental-health companion is designed for **general wellbeing support**, not diagnosis, treatment, or emergency response.

The current implementation includes simple text-pattern detection for potentially crisis-related messages. This should be treated as a prototype rather than a reliable safety mechanism.

Before using the feature in a production environment:

-   Add vetted local crisis and emergency resources.
    
-   Provide clear escalation guidance.
    
-   Avoid presenting generated suggestions as medical advice.
    
-   Protect sensitive user conversations.
    
-   Implement appropriate privacy and data-retention policies.
    
-   Have the experience reviewed by qualified mental-health professionals.
    
-   Add robust testing for crisis-related scenarios.
    

**Do not rely on the application as an emergency service.**

----------

## 🧪 Testing

Automated tests are not currently included.

For a growing codebase, consider adding:

-   **Vitest** for unit and integration testing
    
-   **React Testing Library** for component behavior
    
-   End-to-end testing for important user journeys
    
-   Tests for appointment and medication service logic
    
-   Tests for map loading and error states
    
-   Safety-focused tests for the mental-health companion
    

Example future test structure:

```text
src/
├── Appointments/
│   ├── ...
│   └── __tests__/
├── Medication/
│   ├── ...
│   └── __tests__/
└── Chatbot/
    ├── ...
    └── __tests__/

```

----------

## 🏗️ Production Build & Deployment

Uzima is a client-side single-page application and can be deployed to most static hosting platforms.

Build the application with:

```bash
npm run build

```

Then deploy the generated:

```text
dist/

```

directory.

Compatible hosting options include:

-   Netlify
    
-   Vercel
    
-   GitHub Pages
    
-   AWS S3 + CloudFront
    
-   Other static hosting providers
    

### SPA routing

Because the application uses client-side routing, configure the hosting provider to serve `index.html` for unknown application routes. Without this fallback, directly visiting routes such as `/appointments` or `/mental-health` may result in a 404 after deployment.

----------

## 🔐 Environment Variables & Secrets

The current project does not require a backend or authentication service.

If you introduce external APIs, configure sensitive or environment-specific values through Vite environment variables rather than committing credentials to the repository.

For example:

```text
.env.local

```

and:

```env
VITE_API_BASE_URL=...

```

Never commit API keys, access tokens, passwords, or other secrets to source control.

----------

## 🤝 Contributing

Contributions are welcome.

A typical workflow is:

1.  Fork the repository.
    
2.  Create a feature branch.
    
3.  Make focused changes.
    
4.  Run linting and tests.
    
5.  Verify the production build.
    
6.  Open a pull request with a clear description of the changes.
    

For UI/UX changes, include screenshots or a short explanation where useful.

If you introduce a new API, environment variable, dependency, or architectural pattern, update this README accordingly.

----------

## 📌 Roadmap Ideas

Potential improvements include:

-   Replace mock services with a real backend
    
-   Add user authentication
    
-   Persist appointments and medications
    
-   Add automated tests
    
-   Add loading and error states
    
-   Improve accessibility
    
-   Add responsive/mobile-specific improvements
    
-   Add vetted local mental-health resources
    
-   Add healthcare facility filtering and search
    
-   Add environment-based API configuration
    
-   Add CI/CD checks
    
-   Add a production license
    

----------

## 📄 License

No license is currently included with the project.

If you intend to distribute or open-source Uzima, add a `LICENSE` file containing the terms under which others may use, modify, and distribute the project.

----------

## 📬 Project Status

Uzima is currently a **client-side prototype** intended to demonstrate the core wellness-dashboard experience.

The application is suitable for experimentation and further development, but features such as persistent storage, authentication, production-grade API integration, comprehensive testing, and clinical/safety review should be addressed before considering a production deployment.