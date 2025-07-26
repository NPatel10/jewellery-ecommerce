# Jewellery E-Commerce Backend

The backend API for the jewelry e-commerce platform built with Node.js, Express, and MongoDB.

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 🏗️ Project Structure

```
server/
├── models/              # Database models
│   ├── User.js          # User schema
│   ├── Product.js       # Product schema
│   └── Order.js         # Order schema
├── routes/              # API routes
│   ├── auth.js          # Authentication routes
│   ├── products.js      # Product routes
│   └── orders.js        # Order routes
├── middleware/          # Custom middleware
│   └── auth.js          # Authentication middleware
├── .env.example         # Environment variables template
├── index.js             # Main server file
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## 🚀 Features

### Authentication & Authorization
- **JWT-based Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access Control**: Admin and User roles
- **Protected Routes**: Middleware for route protection

### Product Management
- **CRUD Operations**: Create, read, update, delete products
- **Category Filtering**: Filter products by category
- **Price Range Filtering**: Filter by min/max price
- **Search Functionality**: Search by name and description
- **Stock Management**: Track product inventory

### Order Management
- **Order Creation**: Process new orders
- **Order Tracking**: View order history and status
- **Stock Updates**: Automatic inventory management
- **Admin Overview**: View all orders (admin only)

### API Features
- **RESTful Design**: Standard HTTP methods
- **Input Validation**: Mongoose schema validation
- **Error Handling**: Comprehensive error responses
- **CORS Support**: Cross-origin requests enabled

## 🔧 Environment Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env file**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jewellery_ecommerce
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```

5. **Start the server**
   ```bash
   npm run dev  # Development with nodemon
   # or
   npm start    # Production
   ```

## 📦 Available Scripts

- `npm run dev` - Start with nodemon (auto-restart on changes)
- `npm start` - Start production server
- `npm test` - Run tests (placeholder)

## 🗄️ Database Models

### User Model
```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Product Model
```javascript
{
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['rings', 'necklaces', 'earrings', 'bracelets', 'watches', 'other']
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  images: [String],
  material: {
    type: String,
    enum: ['gold', 'silver', 'platinum', 'diamond', 'pearl', 'other']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}
```

### Order Model
```javascript
{
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: ObjectId,
      ref: 'Product'
    },
    quantity: Number,
    price: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  }
}
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### POST `/api/auth/login`
User login
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/me`
Get current user (requires authentication)
```http
Authorization: Bearer <jwt_token>
```

### Product Routes (`/api/products`)

#### GET `/api/products`
Get all products (public)
- Query parameters: `category`, `minPrice`, `maxPrice`, `search`

#### GET `/api/products/:id`
Get single product (public)

#### POST `/api/products`
Create new product (admin only)
```json
{
  "name": "Diamond Ring",
  "description": "Beautiful diamond ring",
  "price": 1299.99,
  "category": "rings",
  "stock": 10,
  "material": "diamond"
}
```

#### PUT `/api/products/:id`
Update product (admin only)

#### DELETE `/api/products/:id`
Soft delete product (admin only)

### Order Routes (`/api/orders`)

#### GET `/api/orders`
Get user's orders (requires authentication)

#### GET `/api/orders/all`
Get all orders (admin only)

#### POST `/api/orders`
Create new order (requires authentication)
```json
{
  "items": [
    {
      "product": "product_id",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345",
    "country": "USA"
  },
  "paymentMethod": "credit_card"
}
```

#### GET `/api/orders/:id`
Get single order (user must own order or be admin)

#### PUT `/api/orders/:id/status`
Update order status (admin only)
```json
{
  "status": "shipped"
}
```

## 🔐 Authentication & Security

### JWT Implementation
```javascript
// Token generation
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Token verification middleware
const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // ... verification logic
};
```

### Password Security
```javascript
// Password hashing (pre-save middleware)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

### Role-based Access Control
```javascript
const adminAuth = async (req, res, next) => {
  await auth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin required.' });
    }
    next();
  });
};
```

## 🛡️ Middleware

### CORS Configuration
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // React dev server
  credentials: true
}));
```

### Body Parser
```javascript
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
```

### Authentication Middleware
- Token validation
- User verification
- Role checking

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```
This starts the server with nodemon for automatic restarts on file changes.

### Environment Variables
```env
PORT=5000                    # Server port
MONGODB_URI=mongodb://...    # Database connection string
JWT_SECRET=your_secret       # JWT signing secret
NODE_ENV=development         # Environment mode
```

### Database Connection
```javascript
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('MongoDB connection error:', error));
```

## 🚀 Production Deployment

### Build Steps
1. Set environment variables
2. Install production dependencies
3. Start with `npm start`

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/jewellery_ecommerce
JWT_SECRET=your_production_secret_key
NODE_ENV=production
```

### Security Considerations
- Use strong JWT secrets
- Enable HTTPS in production
- Validate all inputs
- Rate limiting (consider implementing)
- Security headers (consider helmet.js)

## 🔍 Error Handling

### Standard Error Responses
```json
{
  "message": "Error description",
  "status": 400
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing

### API Testing with curl
```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get products
curl http://localhost:5000/api/products
```

## 🔮 Future Enhancements

- [ ] File upload for product images
- [ ] Email notifications
- [ ] Payment processing integration
- [ ] Rate limiting middleware
- [ ] API documentation (Swagger)
- [ ] Comprehensive testing suite
- [ ] Logging system
- [ ] Database migrations
- [ ] Redis caching
- [ ] WebSocket real-time updates

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB connection failed**
   - Check MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **JWT token errors**
   - Verify JWT_SECRET is set
   - Check token format in requests

3. **CORS errors**
   - Verify frontend URL in CORS config
   - Check request headers

4. **Port already in use**
   ```bash
   lsof -ti:5000 | xargs kill -9
   ```

## 📋 Dependencies

### Production Dependencies
- express: ^5.x - Web framework
- mongoose: ^8.x - MongoDB ODM
- bcryptjs: ^3.x - Password hashing
- jsonwebtoken: ^9.x - JWT implementation
- cors: ^2.x - CORS middleware
- dotenv: ^17.x - Environment variables
- body-parser: ^2.x - Request body parsing

### Development Dependencies
- nodemon: ^3.x - Development server with auto-restart