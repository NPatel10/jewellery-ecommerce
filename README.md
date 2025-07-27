# Jewellery E-Commerce

A full-stack JavaScript monorepo for a jewelry e-commerce platform built with React (Vite) + Tailwind CSS frontend and Node.js + Express + MongoDB backend.

## 🏗️ Architecture

```
jewellery-ecommerce/
├── client/          # React frontend with Vite & Tailwind CSS
├── server/          # Node.js backend with Express & MongoDB
├── package.json     # Root package.json with concurrently setup
├── eslint.config.js # Root ESLint configuration
├── .prettierrc      # Prettier configuration
└── README.md        # This file
```

## 🚀 Features

### Frontend (React + Vite + Tailwind CSS)
- **User Interface**: Shopping cart, product catalog, user dashboard
- **Admin Interface**: Product management, order management, user management, analytics
- **Authentication**: JWT-based login/register with role-based access
- **Analytics Dashboard**: Sales charts, user growth, top products visualization
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Routing**: React Router with protected routes and 404 handling
- **Charts**: Recharts and Chart.js for data visualization

### Backend (Node.js + Express + MongoDB)
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Cookie Support**: HttpOnly cookies for secure JWT storage
- **Role-based Access Control**: Admin and User roles with proper redirects
- **RESTful API**: Products, Orders, Users, Authentication endpoints
- **Analytics API**: Dashboard data, sales reports, user growth metrics
- **Database**: MongoDB with Mongoose ODM
- **Error Handling**: Global error handler with proper error responses
- **Middleware**: CORS, body-parser, cookie-parser, authentication middleware

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing with protected routes
- **Axios** - HTTP client
- **Chart.js** - Chart library for data visualization
- **Recharts** - React chart library for modern charts

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **cookie-parser** - Cookie parsing middleware
- **dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code linting (root + client configs)
- **Prettier** - Code formatting
- **Nodemon** - Server auto-restart
- **Concurrently** - Run multiple commands

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jewellery-ecommerce
   ```

2. **Install all dependencies**
   ```bash
   npm run install-deps
   ```

3. **Setup environment variables**
   ```bash
   # Create environment file in server directory
   cp server/.env.example server/.env
   
   # Edit server/.env with your configuration
   nano server/.env
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or start MongoDB service
   sudo systemctl start mongod
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend dev server at `http://localhost:5173`
   - Backend API server at `http://localhost:5000`

## 🔧 Environment Configuration

Create a `.env` file in the `server/` directory based on `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jewellery_ecommerce
JWT_SECRET=your_jwt_secret_key_here_very_secure_random_string
NODE_ENV=development
```

### Environment Variables Explained
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing (use a strong, random string)
- `NODE_ENV`: Environment mode (development/production)

## 📱 Usage

### For Users
1. **Register/Login**: Create an account or sign in at `/login`
2. **Browse Products**: View jewelry catalog with filters at `/storefront`
3. **Shopping Cart**: Add items and place orders
4. **Order History**: Track your past orders in user dashboard

### For Admins
1. **Login with Admin Role**: Use admin credentials at `/login`
2. **Analytics Dashboard**: View comprehensive business metrics
3. **Product Management**: Add, edit, delete products
4. **Order Management**: View and update order statuses
5. **User Management**: View registered users
6. **Sales Analytics**: Monitor sales trends and performance

### Authentication Flow
- Login redirects to `/admin` for admin users
- Login redirects to `/user` for regular users
- JWT tokens stored in both localStorage and HttpOnly cookies
- Protected routes enforce role-based access

## 🚀 Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend in development mode
- `npm run client` - Start only the frontend
- `npm run server` - Start only the backend
- `npm run build` - Build the frontend for production
- `npm run install-deps` - Install dependencies for all packages
- `npm run lint` - Run ESLint with auto-fix
- `npm run lint:check` - Check linting without fixing
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Client Directory
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for client code

### Server Directory
- `npm run dev` - Start with nodemon (auto-restart)
- `npm start` - Start production server

## 🔐 Authentication & Authorization

The application implements JWT-based authentication with role-based access control:

### Roles
- **User**: Can browse products, place orders, view order history
- **Admin**: Can manage products, orders, users, and view analytics

### Protected Routes
- `/user/*` - Requires user authentication
- `/admin/*` - Requires admin authentication
- API endpoints protected with middleware
- 404 page for undefined routes

### JWT Storage
- **localStorage**: For client-side token access
- **HttpOnly Cookies**: For secure server-side token handling
- Automatic token validation on requests
- Secure logout with cookie clearing

## 📊 Analytics Dashboard

The admin dashboard provides comprehensive business analytics:

### Charts Available
- **Sales Over Time**: Line chart showing daily revenue trends
- **Category Distribution**: Doughnut chart of sales by product category
- **User Growth**: Area chart showing new customer registrations
- **Top Products**: Bar chart of best-selling products by revenue

### Metrics Displayed
- Total Revenue, Orders, Customers, Products
- Monthly growth statistics
- Recent orders table
- Real-time dashboard updates

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user|admin),
  createdAt: Date
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  images: [String],
  material: String,
  isActive: Boolean,
  createdAt: Date
}
```

### Order Schema
```javascript
{
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String,
  shippingAddress: Object,
  paymentMethod: String,
  paymentStatus: String,
  createdAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login (sets HttpOnly cookie + returns token)
- `POST /api/auth/logout` - User logout (clears HttpOnly cookie)
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/all` - Get all orders (admin only)
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders/:id` - Get single order (protected)
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Admin Analytics
- `GET /api/admin/reports/dashboard` - Dashboard overview stats
- `GET /api/admin/reports/sales` - Sales analytics with charts data
- `GET /api/admin/reports/customers` - Customer growth and analytics
- `GET /api/admin/reports/products` - Product performance metrics

### Data Format
Analytics endpoints return data in the format:
```javascript
[{label: 'Jan', value: 1000}, {label: 'Feb', value: 1200}, ...]
```

## 🚀 Deployment

### Frontend (Vite)
```bash
cd client
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend (Express)
```bash
cd server
npm start
# Or deploy to your preferred hosting service
```

### Environment Setup for Production
- Set `NODE_ENV=production`
- Use strong JWT secret
- Configure MongoDB Atlas for cloud database
- Enable HTTPS for secure cookies
- Update CORS origins for production domain

## 🔧 Development Workflow

1. **Setup Development Environment**
   ```bash
   npm run install-deps
   cp server/.env.example server/.env
   # Edit .env with your settings
   ```

2. **Start Development Servers**
   ```bash
   npm run dev
   ```

3. **Code Quality Checks**
   ```bash
   npm run lint:check
   npm run format:check
   ```

4. **Fix Code Issues**
   ```bash
   npm run lint
   npm run format
   ```

5. **Build for Production**
   ```bash
   npm run build
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and formatting: `npm run lint && npm run format`
5. Test your changes thoroughly
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed description
3. Provide steps to reproduce the problem

## 🔮 Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] Image upload functionality
- [ ] Email notifications
- [ ] Advanced search and filters
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Inventory management
- [x] Analytics dashboard
- [ ] Mobile app (React Native)