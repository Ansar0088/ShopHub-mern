# ShopHub - E-Commerce Platform

A full-stack e-commerce platform built with Next.js, MongoDB, and Stripe/WhatsApp integration.

## Features

### Customer Features
- **Product Browsing**: Browse products by category with filtering
- **Shopping Cart**: Add/remove items, update quantities
- **Secure Checkout**: Two-step checkout process
- **Payment Options**: 
  - Stripe card payments
  - WhatsApp checkout for manual processing
- **Order Tracking**: View order history and status
- **User Accounts**: Register, login, and profile management

### Admin Features
- **Dashboard**: Overview of sales, orders, and customers
- **Product Management**: Create, edit, delete products
- **Order Management**: View and manage customer orders
- **Inventory Control**: Track product stock levels

## Tech Stack

- **Frontend**: Next.js 16 with React 19
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT-based auth with bcrypt
- **Payments**: Stripe integration
- **Communication**: WhatsApp integration
- **Styling**: Tailwind CSS v4 with shadcn/ui

## Project Structure

```
app/
  ├── page.tsx              # Home page
  ├── shop/                 # Shop page
  ├── products/[id]/        # Product detail page
  ├── cart/                 # Shopping cart
  ├── checkout/             # Checkout flow
  ├── auth/                 # Authentication pages
  ├── admin/                # Admin dashboard
  └── api/                  # API routes
      ├── auth/             # Authentication endpoints
      ├── products/         # Product management
      ├── cart/             # Cart management
      ├── orders/           # Order management
      └── payments/         # Payment processing

components/
  ├── auth-provider.tsx     # Auth context and hooks
  ├── cart-context.tsx      # Cart state management
  ├── navbar.tsx            # Navigation bar
  ├── product-card.tsx      # Product display card
  └── payment-selector.tsx  # Payment method selection

lib/
  ├── db.ts                 # MongoDB connection
  ├── models.ts             # TypeScript interfaces
  ├── auth.ts               # Authentication utilities
  ├── stripe.ts             # Stripe client
  └── api-response.ts       # Response formatting
```

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_secret_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# WhatsApp
WHATSAPP_BUSINESS_PHONE=your_whatsapp_business_number
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

The application uses MongoDB. Make sure you have:
1. A MongoDB Atlas account (free tier available)
2. A database created named "ecommerce"

The application will automatically create collections as needed.

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your store.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify JWT token

### Products
- `GET /api/products` - List all products
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/[id]` - Remove item from cart

### Orders
- `GET /api/orders` - List user's orders
- `POST /api/orders` - Create new order

### Payments
- `POST /api/payments/stripe` - Initialize Stripe payment
- `POST /api/payments/stripe/confirm` - Confirm Stripe payment
- `POST /api/payments/whatsapp` - Generate WhatsApp payment link

## Admin Access

1. Create an admin account by directly updating MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

2. Login with admin credentials
3. Access dashboard at `/admin`

## Database Schema

### Users
```javascript
{
  _id: ObjectId,
  email: string,
  password: string (hashed),
  name: string,
  role: "customer" | "admin",
  phone?: string,
  address?: { street, city, state, zip, country },
  createdAt: Date,
  updatedAt: Date
}
```

### Products
```javascript
{
  _id: ObjectId,
  name: string,
  description: string,
  price: number,
  stock: number,
  category: string,
  images: string[],
  rating: number,
  reviews: number,
  sku: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders
```javascript
{
  _id: ObjectId,
  userId: string,
  items: [{ productId, quantity, price }],
  total: number,
  status: "pending" | "processing" | "shipped" | "delivered",
  paymentStatus: "pending" | "completed" | "failed",
  paymentMethod: "stripe" | "whatsapp",
  shippingAddress: { street, city, state, zip, country },
  createdAt: Date,
  updatedAt: Date
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
vercel deploy
```

## Security Best Practices

- Passwords are hashed with bcrypt (12 rounds)
- JWT tokens expire after 7 days
- API routes validate user authentication
- MongoDB connection is cached in production
- Environment variables are never exposed to client

## Testing the Platform

1. **Create a Product**:
   - Go to `/admin` (login as admin first)
   - Click "Add New Product"
   - Fill in product details

2. **Browse Products**:
   - Visit `/shop`
   - View product details
   - Add to cart

3. **Checkout**:
   - Go to `/cart`
   - Click "Proceed to Checkout"
   - Enter shipping details
   - Choose payment method

4. **View Orders**:
   - Login as customer
   - View order history

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string in `.env.local`
- Check IP whitelist in MongoDB Atlas
- Ensure database name is "ecommerce"

### Payment Issues
- Verify Stripe keys are correct
- Check Stripe account status
- Test with Stripe test cards

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET is set
- Verify token expiration

## Future Enhancements

- Email notifications
- Product reviews and ratings
- Wishlist functionality
- Advanced admin analytics
- Inventory management system
- Multiple payment gateways
- Order refund system
- Customer support chat

## License

MIT
# ShopHub-mern
