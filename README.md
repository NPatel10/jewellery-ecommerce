# Jewellery E-Commerce

A full-stack JavaScript monorepo for a jewelry e-commerce platform built with React (Vite) + Tailwind CSS frontend and Node.js + Express + MongoDB backend.

## 🏗️ Architecture

```
jewellery-ecommerce/
├── client/          # React frontend with Vite & Tailwind CSS
├── server/          # Node.js backend with Express & MongoDB
├── package.json     # Root package.json with concurrently setup
└── README.md        # This file
```

## 🚀 Features

### Frontend (React + Vite + Tailwind CSS)
- **User Interface**: Shopping cart, product catalog, user dashboard
- **Admin Interface**: Product management, order management, user management, analytics
- **Authentication**: JWT-based login/register with role-based access
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Routing**: React Router with protected routes

### Backend (Node.js + Express + MongoDB)
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Role-based Access Control**: Admin and User roles
- **RESTful API**: Products, Orders, Users, Authentication endpoints
- **Database**: MongoDB with Mongoose ODM
- **Middleware**: CORS, body-parser, authentication middleware

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

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
   # Copy the example environment file
   cp server/.env.example server/.env
   
   # Edit server/.env with your configuration
   ```

4. **Start the development servers**
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
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## 📱 Usage

### For Users
1. **Register/Login**: Create an account or sign in
2. **Browse Products**: View jewelry catalog with filters
3. **Shopping Cart**: Add items and place orders
4. **Order History**: Track your past orders

### For Admins
1. **Login with Admin Role**: Use admin credentials
2. **Product Management**: Add, edit, delete products
3. **Order Management**: View and update order statuses
4. **User Management**: View registered users
5. **Analytics**: View sales and performance metrics

## 🚀 Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend in development mode
- `npm run client` - Start only the frontend
- `npm run server` - Start only the backend
- `npm run build` - Build the frontend for production
- `npm run install-deps` - Install dependencies for all packages

### Client Directory
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

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
- API endpoints are protected with middleware

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
- `POST /api/auth/login` - User login
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

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
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)