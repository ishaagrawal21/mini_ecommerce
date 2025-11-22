# Mini E-Commerce Application

A full-stack e-commerce application built with React.js and Node.js/Express, featuring product and category management with user authentication.

## 🚀 Features

### Authentication
- **User Registration**: Sign up with name, email, and password
- **User Login**: Secure authentication using JWT tokens
- **Protected Routes**: Access to products and categories requires authentication
- **Password Visibility Toggle**: Eye icon to show/hide password in login and signup forms
- **Session Management**: Token stored in localStorage for persistent sessions

### Product Management
- **Product Listing**: Display products in a responsive card grid layout
- **Add Product**: Modal form to add new products with:
  - Product name, description, and price
  - Category selection via dropdown
  - Image upload with preview
  - Form validation using React Hook Form
- **Edit Product**: Update existing products with pre-filled form values
- **Delete Product**: Remove products with confirmation dialog
- **Product Search**: Search products by name
- **Advanced Filtering**:
  - Filter by category (dropdown)
  - Filter by price range (min/max with placeholders)
  - Apply and Reset filter buttons
- **Image Display**: Product images shown in cards with full URL support

### Category Management
- **Category Listing**: Display categories in a table format
- **Add Category**: Modal form to add new categories with name and description
- **Edit Category**: Update existing categories
- **Delete Category**: Remove categories with confirmation dialog
- **Category Search**: Search categories by name
- **Reset Filter**: Clear search filters

### UI/UX Features
- **Material UI Components**: Modern and responsive design
- **Modal Forms**: Add/Edit forms in dialogs for better UX
- **Floating Action Buttons (FAB)**: Quick access to add products/categories with tooltips
- **Loading States**: Loading indicators during API calls
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on desktop and mobile devices
- **Price Display**: Prices shown in "Rs" (Rupees) currency format

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Material UI (MUI)** - Component library
- **TanStack Query (React Query)** - Data fetching and caching
- **React Hook Form** - Form management and validation
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT (jsonwebtoken)** - Authentication
- **bcrypt** - Password hashing
- **express-fileupload** - File upload handling
- **Joi** - Request validation

## 📁 Project Structure

```
mini-ecommerce-task/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/        # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── CategoryList.jsx
│   │   │   ├── CategoryForm.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── SignIn.jsx
│   │   │   └── SignUp.jsx
│   │   ├── utills/         # Utility functions
│   │   │   └── apiHelper.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                 # Backend Node.js application
│   ├── controller/         # Route controllers
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   └── auth.controller.js
│   ├── model/             # Mongoose models
│   │   ├── ProductModel.js
│   │   ├── CategoryModel.js
│   │   └── UserModel.js
│   ├── router/            # Express routes
│   │   ├── ProductRoutes.js
│   │   ├── CategoryRoutes.js
│   │   └── AuthRoutes.js
│   ├── middleware/        # Express middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── upload.js
│   │   └── validateRequest.js
│   ├── utils/             # Utility functions
│   │   └── fileUpload.js
│   ├── uploads/           # Uploaded images directory
│   ├── app.js             # Express app entry point
│   ├── connection.js      # MongoDB connection
│   └── package.json
│
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini-ecommerce-task
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mini-ecommerce
   JWT_SECRET=your-secret-key-here
   PROTOCOL=http
   HOST=localhost
   BASE_URL=http://localhost:5000
   ```

5. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   # Or use MongoDB Atlas connection string in .env
   ```

6. **Start Backend Server**
   ```bash
   cd server
   npm start
   ```
   Server will run on `http://localhost:5000`

7. **Start Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (with filters: q, category, minPrice, maxPrice)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Categories
- `GET /api/categories` - Get all categories (with filter: q)
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create new category (protected)
- `PUT /api/categories/:id` - Update category (protected)
- `DELETE /api/categories/:id` - Delete category (protected)

## 🔐 Authentication Flow

1. User signs up or signs in
2. Backend returns JWT token and user data
3. Token stored in localStorage
4. Token included in API requests via Authorization header
5. Protected routes verify token before allowing access

## 📸 Features in Detail

### Product Management
- **Card Layout**: Products displayed in responsive grid with image, name, description, price, and category
- **Image Upload**: Upload product images using file input, stored in `/uploads` directory
- **Full URL Images**: Backend returns complete image URLs (e.g., `http://localhost:5000/uploads/filename.jpeg`)
- **Category Dropdown**: Select category from dropdown in both filter and form
- **Price Filter**: Filter products by price range with min/max inputs

### Category Management
- **Table View**: Categories displayed in a clean table format
- **Description Field**: Categories can have descriptions
- **Search Functionality**: Real-time search by category name

### Form Features
- **Modal Dialogs**: All add/edit forms in Material UI dialogs
- **Form Validation**: Client-side validation using React Hook Form
- **Image Preview**: Preview uploaded images before submission
- **Pre-filled Values**: Edit forms automatically populate with existing data

## 🎨 UI Components

- **Header**: Navigation with Products/Categories links and user profile menu with logout
- **Footer**: Copyright information
- **FAB Buttons**: Floating action buttons with tooltips for quick actions
- **Search Bars**: Integrated search with search button
- **Filter Controls**: Category dropdown, price range inputs with Apply/Reset buttons
- **Cards**: Product cards with image, details, and action buttons
- **Tables**: Category listing in table format
- **Dialogs**: Confirmation dialogs for delete actions

## 🔧 Configuration

### Backend Configuration
- Server port: Set in `.env` file (default: 5000)
- MongoDB connection: Configure in `.env` file
- JWT secret: Set in `.env` file for token signing
- File upload: Images stored in `server/uploads/` directory

### Frontend Configuration
- API base URL: Configured in `client/src/utills/apiHelper.js`
- Default API URL: `http://localhost:5000/api`

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env` file

2. **Image Upload Not Working**
   - Ensure `server/uploads/` directory exists
   - Check file permissions
   - Verify `express-fileupload` middleware is configured

3. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check JWT_SECRET in `.env` file
   - Verify token is being sent in request headers

4. **CORS Errors**
   - Ensure backend CORS is configured correctly
   - Check API base URL in frontend

## 📝 Scripts

### Backend
- `npm start` - Start server with nodemon (auto-restart on changes)

### Frontend
- `npm run dev` - Start development server


## 🚀 Deployment

### Backend Deployment
1. Set environment variables in production
2. Ensure MongoDB connection is configured
3. Set up file upload directory with proper permissions
4. Use process manager like PM2

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy `dist` folder to hosting service (Vercel, Netlify, etc.)
3. Update API base URL for production



## 👨‍💻 Author

Mini E-Commerce Task Application

## 🙏 Acknowledgments

- Material UI for component library
- TanStack Query for data fetching
- React Hook Form for form management
- Express.js community for excellent documentation

