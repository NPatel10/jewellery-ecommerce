# Jewellery E-Commerce Frontend

The frontend application for the jewelry e-commerce platform built with React, Vite, and Tailwind CSS.

## 🛠️ Tech Stack

- **React 18** - UI library with modern hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests

## 🏗️ Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Login.jsx    # Authentication component
│   │   ├── UserDashboard.jsx    # User interface
│   │   ├── AdminDashboard.jsx   # Admin interface
│   │   └── ProtectedRoute.jsx   # Route protection
│   ├── contexts/        # React contexts
│   │   └── AuthContext.jsx      # Authentication context
│   ├── assets/          # Images, icons, etc.
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # App entry point
│   └── index.css        # Global styles with Tailwind
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── vite.config.js       # Vite configuration
```

## 🚀 Features

### User Interface
- **Product Catalog**: Browse jewelry with responsive grid layout
- **Shopping Cart**: Add/remove items, quantity management
- **User Dashboard**: Order history and account management
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Admin Interface
- **Product Management**: CRUD operations for jewelry items
- **Order Management**: View and update order statuses
- **User Management**: View registered users
- **Analytics Dashboard**: Sales metrics and performance indicators

### Authentication
- **JWT-based Auth**: Secure login/logout functionality
- **Role-based Access**: Different interfaces for users and admins
- **Protected Routes**: Route guards based on authentication status
- **Context-based State**: Global authentication state management

## 🔧 Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start Vite development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🎨 Styling with Tailwind CSS

This project uses Tailwind CSS for styling. Key features:

### Responsive Design
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid layout */}
</div>
```

### Component Styling
```jsx
<button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">
  Click me
</button>
```

### Dark Mode Support
The project is configured for potential dark mode implementation.

## 🔐 Authentication Flow

### Login Process
1. User enters credentials in Login component
2. AuthContext handles API call to backend
3. JWT token stored in localStorage
4. User redirected based on role (user/admin)

### Protected Routes
```jsx
<Route path="/admin" element={
  <ProtectedRoute role="admin">
    <AdminDashboard />
  </ProtectedRoute>
} />
```

## 🔌 API Integration

### Base Configuration
```javascript
// AuthContext.jsx
const response = await axios.post('http://localhost:5000/api/auth/login', {
  email,
  password,
});
```

### Authentication Headers
```javascript
// Automatic token attachment
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

## 📱 Component Overview

### Login Component
- Dual-mode form (login/register)
- Form validation and error handling
- Role selection for registration
- Responsive design with Tailwind

### UserDashboard Component
- Product catalog with sample data
- Shopping cart functionality placeholder
- Navigation with logout option
- Grid layout for products

### AdminDashboard Component
- Tabbed interface for different admin functions
- Product management table
- Order management with status indicators
- User management interface
- Analytics cards with metrics

### AuthContext
- Global authentication state
- Login/logout/register functions
- Token management
- User persistence

## 🌐 Routing Structure

```javascript
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/user" element={
    <ProtectedRoute role="user">
      <UserDashboard />
    </ProtectedRoute>
  } />
  <Route path="/admin" element={
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  } />
  <Route path="/" element={<Navigate to="/login" replace />} />
</Routes>
```

## 🔨 Build Configuration

### Vite Configuration
- Fast HMR (Hot Module Replacement)
- Optimized production builds
- React plugin for JSX support

### Tailwind Configuration
- Configured for React JSX files
- Production-ready with purging
- Responsive breakpoints included

## 🚀 Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` directory ready for deployment.

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced product filtering
- [ ] Image gallery components
- [ ] Progressive Web App (PWA) features
- [ ] Internationalization (i18n)
- [ ] Dark mode toggle
- [ ] Performance optimizations
- [ ] Unit and integration tests

## 🐛 Troubleshooting

### Common Issues

1. **Vite dev server not starting**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Tailwind styles not applying**
   - Check if PostCSS and Tailwind configs are correct
   - Verify `@tailwind` directives in index.css

3. **API connection issues**
   - Ensure backend server is running on port 5000
   - Check CORS configuration in backend

## 📄 Dependencies

### Core Dependencies
- react: ^18.x
- react-dom: ^18.x
- react-router-dom: ^6.x
- axios: Latest

### Development Dependencies
- @vitejs/plugin-react: Latest
- vite: ^6.x
- tailwindcss: ^4.x
- postcss: Latest
- autoprefixer: Latest
