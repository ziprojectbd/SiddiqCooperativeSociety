# Somobay Somiti Management System

A comprehensive Next.js-based management system for Somobay Somiti (cooperative savings groups) with admin and member portals.

## 📋 Features

### Admin Portal
- **Dashboard** - Overview of total members, deposits, active loans, and savings
- **Members Management** - Add, edit, and manage somobay members
- **Daily Deposits** - Track and manage daily deposit records
- **Loan Management** - Create and monitor loan applications
- **Loan Payments** - Track loan repayments and payment history
- **Reports** - Generate financial reports and statistics

### Member Portal
- **Dashboard** - Personal account overview and statistics
- **Somiti Summary** - View somiti rules and overall statistics
- **Loan List** - Browse all loans in the somobay
- **My Deposit** - Add new deposits and view recent activity
- **Deposit History** - Complete deposit transaction history
- **My Loan** - View personal loan details and payment history

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd windsurf-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/somobay-somiti
   JWT_SECRET=your-secret-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB**
   Ensure MongoDB is running on your system:
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest

   # Or start MongoDB service
   # Windows: Start MongoDB service from Services
   # Linux/Mac: sudo systemctl start mongod
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Default Credentials

### Admin Account
- **Phone**: 01700000000
- **Password**: admin123

### Member Account
- **Phone**: 01700000001
- **Password**: member123

## 📁 Project Structure

```
windsurf-project/
├── app/
│   ├── admin/                    # Admin Portal (6 pages)
│   │   ├── dashboard/
│   │   ├── members/
│   │   ├── deposits/
│   │   ├── loans/
│   │   ├── loan-payments/
│   │   └── reports/
│   ├── member/                   # Member Portal (6 pages)
│   │   ├── dashboard/
│   │   ├── somiti-summary/
│   │   ├── loan-list/
│   │   ├── my-deposit/
│   │   ├── deposit-history/
│   │   └── my-loan/
│   ├── api/[[...path]]/          # API Routes (15+ endpoints)
│   ├── layout.js                 # Root Layout
│   ├── page.js                   # Login Page
│   └── globals.css               # Global Styles
├── components/                   # React Components
│   ├── Sidebar.js
│   └── StatCard.js
├── lib/
│   └── utils.js                  # Utility Functions
├── scripts/
│   └── seed.js                   # Database Seed Script
├── .env                          # Environment Variables
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind Config
└── README.md                     # Documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Deposits
- `GET /api/deposits` - Get all deposits
- `GET /api/deposits?memberId=:id` - Get deposits by member
- `POST /api/deposits` - Create new deposit

### Loans
- `GET /api/loans` - Get all loans
- `GET /api/loans?memberId=:id` - Get loans by member
- `POST /api/loans` - Create new loan
- `PUT /api/loans/:id` - Update loan

### Loan Payments
- `GET /api/loan-payments` - Get all payments
- `GET /api/loan-payments?memberId=:id` - Get payments by member
- `POST /api/loan-payments` - Create new payment

### Statistics
- `GET /api/stats/dashboard` - Dashboard statistics
- `GET /api/stats/member/:id` - Member statistics

## 🗄️ Database Collections

- **members** - User accounts with roles (admin/member)
- **deposits** - Daily deposit records
- **loans** - Loan applications and details
- **loanPayments** - Loan repayment records

## 📊 Seeded Data

After running the seed script, the database will contain:
- 7 members (1 admin + 6 members)
- 2,750+ deposit records (12 months of data)
- 4 loan records
- 6 loan payment records

## 🎨 UI Components

The project uses:
- **Tailwind CSS** for styling
- **Lucide React** for icons
- Custom components:
  - `Sidebar` - Navigation sidebar for admin/member portals
  - `StatCard` - Display statistics with icons

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## 📝 Somobay Rules

- Monthly contribution of ৳500 per member
- Loans available after 6 months of membership
- Maximum loan amount: ৳50,000
- Interest rate: 10% per annum
- Monthly meetings on first Sunday of every month

## 🛡️ Security Notes

- Change `JWT_SECRET` in production
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints
- Add input validation for all forms
- Enable HTTPS in production

## 📄 License

This project is for demonstration purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support and questions, please open an issue in the repository.
