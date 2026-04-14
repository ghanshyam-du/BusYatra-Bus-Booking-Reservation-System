# BusYatra - Bus Booking & Reservation System
## Chapter 4: Methodology: Materials and Methods (Pages 25–39)

---

## Page 25

# CHAPTER 4: METHODOLOGY: MATERIALS AND METHODS

### 4.1 DEVELOPMENT METHODOLOGY

The BusYatra project followed an **Agile-inspired iterative development lifecycle** adapted
for a solo internship project. The development was organized into 6 sprints over 13 weeks,
with each sprint delivering a working increment of the system.

**Development Phases:**

| Phase | Duration | Activities |
|-------|----------|-----------|
| Requirements & Design | Week 1–2 | Requirement gathering, ER diagram, API planning, wireframes |
| Database & Backend Setup | Week 3–4 | MongoDB schema, Express server, auth middleware |
| Core API Development | Week 5–7 | All RESTful endpoints, business logic, validation |
| Frontend Development | Week 6–9 | React components, routing, API integration |
| Integration & Testing | Week 10–11 | End-to-end testing, bug fixes, Postman collection |
| Deployment & Documentation | Week 12–13 | Cloud deployment, API docs, report writing |

**Project Gantt Chart:**

```
Phase                    | W1 | W2 | W3 | W4 | W5 | W6 | W7 | W8 | W9 |W10 |W11 |W12 |W13
Requirements & Design    | ██ | ██ |    |    |    |    |    |    |    |    |    |    |
Database & Backend Setup |    |    | ██ | ██ |    |    |    |    |    |    |    |    |
Core API Development     |    |    |    |    | ██ | ██ | ██ |    |    |    |    |    |
Frontend Development     |    |    |    |    |    | ██ | ██ | ██ | ██ |    |    |    |
Integration & Testing    |    |    |    |    |    |    |    |    |    | ██ | ██ |    |
Deployment & Docs        |    |    |    |    |    |    |    |    |    |    |    | ██ | ██
```

**Figure 9.0: Project Gantt Chart**

---

## Page 26

### 4.2 SYSTEM ARCHITECTURE

BusYatra follows a **three-tier client-server architecture**:

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT TIER                          │
│  React.js SPA (Vite) + Tailwind CSS + React Router     │
│  Axios HTTP Client + Context API / Zustand             │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS / REST API
┌──────────────────────▼──────────────────────────────────┐
│                   SERVER TIER                           │
│  Node.js + Express.js                                  │
│  JWT Auth Middleware + RBAC Middleware                 │
│  Controllers → Services → Models                       │
└──────────────────────┬──────────────────────────────────┘
                       │ Mongoose ODM
┌──────────────────────▼──────────────────────────────────┐
│                   DATA TIER                             │
│  MongoDB Atlas (Cloud)                                 │
│  9 Collections + Optimized Indexes                     │
└─────────────────────────────────────────────────────────┘
```

**Figure 2.0: BusYatra – System Architecture Diagram**

**Architecture Components:**

- **Client Tier**: React.js SPA served via Vercel CDN, communicates with backend via Axios
- **Server Tier**: Express.js REST API hosted on Heroku/Railway, handles business logic
- **Data Tier**: MongoDB Atlas cloud database with Mongoose ODM for schema management

---

## Page 27

### 4.3 DATABASE DESIGN

#### 4.3.1 ENTITY-RELATIONSHIP DIAGRAM

The BusYatra database consists of **9 MongoDB collections** with the following relationships:

**Entities and Key Attributes:**

| Collection | Primary Key | Key Fields |
|-----------|------------|-----------|
| users | _id | name, email, password, role, phone |
| travelers | _id | userId (FK), businessName, approvalStatus |
| admins | _id | userId (FK), permissions |
| buses | _id | travelerId (FK), registrationNo, busType, totalSeats |
| busschedules | _id | busId (FK), route, departureTime, baseFare |
| seats | _id | scheduleId (FK), seatNumber, type, status |
| bookings | _id | userId (FK), scheduleId (FK), journeyDate, status |
| bookingseats | _id | bookingId (FK), seatId (FK), passengerDetails |
| supporttickets | _id | userId (FK), subject, status, priority |

**Relationships:**
- User → Traveler (1:1) — one user can have one traveler profile
- Traveler → Bus (1:N) — one traveler can own multiple buses
- Bus → BusSchedule (1:N) — one bus can have multiple schedules
- BusSchedule → Seat (1:N) — one schedule has 40 auto-generated seats
- User → Booking (1:N) — one user can make multiple bookings
- Booking → BookingSeat (1:N) — one booking can include multiple seats

---

## Page 28

**ER Diagram:**

```
┌──────────┐     1:1    ┌──────────┐     1:N    ┌──────────┐
│  users   │──────────▶│ travelers│──────────▶│   buses  │
│ _id (PK) │           │ _id (PK) │           │ _id (PK) │
│ name     │           │ userId   │           │travelerId│
│ email    │           │ bizName  │           │ busType  │
│ password │           │ approval │           │totalSeats│
│ role     │           └──────────┘           └────┬─────┘
└────┬─────┘                                       │ 1:N
     │ 1:N                                         ▼
     │                                    ┌──────────────┐
     ▼                                    │ busschedules │
┌──────────┐     1:N    ┌──────────┐     │ _id (PK)     │
│ bookings │──────────▶│booking   │     │ busId (FK)   │
│ _id (PK) │           │ seats    │     │ route        │
│ userId   │           │ _id (PK) │     │ departure    │
│ schedId  │           │ bookingId│     │ baseFare     │
│ status   │           │ seatId   │     └──────┬───────┘
└──────────┘           │passenger │            │ 1:N
                       └──────────┘            ▼
                                      ┌──────────────┐
                                      │    seats     │
                                      │ _id (PK)     │
                                      │ scheduleId   │
                                      │ seatNumber   │
                                      │ type, status │
                                      └──────────────┘
```

**Figure 3.0: Entity-Relationship (ER) Diagram**

---

## Page 29

#### 4.3.2 DATABASE SCHEMA DETAILS

**Users Collection:**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (unique, indexed),
  password: String (bcrypt hashed),
  phone: String,
  role: enum ['customer', 'traveler', 'admin'],
  isActive: Boolean (default: true),
  createdAt: Date
}
```

**Buses Collection:**
```javascript
{
  _id: ObjectId,
  travelerId: ObjectId (ref: 'Traveler'),
  registrationNumber: String (unique),
  busType: enum ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper'],
  totalSeats: Number (default: 40),
  amenities: [String],
  isActive: Boolean
}
```

**BusSchedules Collection:**
```javascript
{
  _id: ObjectId,
  busId: ObjectId (ref: 'Bus'),
  travelerId: ObjectId (ref: 'Traveler'),
  route: { source: String, destination: String },
  departureTime: String,
  arrivalTime: String,
  baseFare: Number,
  operatingDays: [String],
  isActive: Boolean
}
```

---

## Page 30

**Bookings Collection:**
```javascript
{
  _id: ObjectId,
  bookingId: String (unique, auto-generated),
  userId: ObjectId (ref: 'User'),
  scheduleId: ObjectId (ref: 'BusSchedule'),
  journeyDate: Date,
  totalSeats: Number,
  totalAmount: Number,
  bookingStatus: enum ['pending', 'confirmed', 'cancelled'],
  paymentStatus: enum ['pending', 'completed', 'refunded'],
  createdAt: Date
}
```

**Indexing Strategy:**

| Collection | Index | Type | Purpose |
|-----------|-------|------|---------|
| users | email | Unique | Fast login lookup |
| busschedules | route.source, route.destination | Compound | Bus search |
| busschedules | busId, isActive | Compound | Operator queries |
| seats | scheduleId, journeyDate | Compound | Availability check |
| bookings | userId | Single | Booking history |
| bookings | bookingId | Unique | Booking lookup |

---

## Page 31

### 4.4 API DESIGN

#### 4.4.1 API ARCHITECTURE

BusYatra follows **RESTful API design principles** with the following conventions:
- Base URL: `https://api.busyatra.com/api/v1`
- Authentication: Bearer JWT token in Authorization header
- Response format: JSON with consistent structure
- Error handling: Centralized error middleware with HTTP status codes

**Standard Response Format:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (dev only)"
}
```

#### 4.4.2 API ENDPOINTS SUMMARY

**Authentication Routes (`/api/auth`):**

| Method | Endpoint | Description | Auth Required |
|--------|---------|-------------|--------------|
| POST | /register | Register new user | No |
| POST | /login | Login and get JWT | No |
| GET | /me | Get current user | Yes |
| POST | /logout | Logout user | Yes |

---

## Page 32

**Bus Routes (`/api/buses`):**

| Method | Endpoint | Description | Role |
|--------|---------|-------------|------|
| GET | / | Get all buses (traveler's) | Traveler |
| POST | / | Add new bus | Traveler |
| GET | /:id | Get bus by ID | Traveler |
| PUT | /:id | Update bus | Traveler |
| DELETE | /:id | Delete bus | Traveler |

**Schedule Routes (`/api/schedules`):**

| Method | Endpoint | Description | Role |
|--------|---------|-------------|------|
| GET | /search | Search buses by route/date | Customer |
| POST | / | Create new schedule | Traveler |
| GET | /:id | Get schedule details | All |
| PUT | /:id | Update schedule | Traveler |
| DELETE | /:id | Delete schedule | Traveler |

**Booking Routes (`/api/bookings`):**

| Method | Endpoint | Description | Role |
|--------|---------|-------------|------|
| POST | / | Create new booking | Customer |
| GET | /my | Get user's bookings | Customer |
| GET | /:id | Get booking details | Customer |
| PUT | /:id/cancel | Cancel booking | Customer |
| GET | /traveler | Get traveler's bookings | Traveler |

---

## Page 33

**Data Flow Diagram – Level 0 (Context Diagram):**

```
                    ┌─────────────────────────────┐
  Search/Book ──▶   │                             │  ──▶ Results/Ticket
  Customer    ◀──   │    BusYatra Booking System  │  ◀──
                    │                             │
  Manage Fleet ──▶  │                             │  ──▶ Analytics/Reports
  Traveler    ◀──   │                             │  ◀──
                    │                             │
  Manage Users ──▶  │                             │  ──▶ System Stats
  Admin        ◀──  │                             │  ◀──
                    └─────────────────────────────┘
```

**Figure 4.0: Data Flow Diagram – Level 0 (Context Diagram)**

**Data Flow Diagram – Level 1:**

```
Customer ──▶ [1. Authentication] ──▶ D1: Users DB
Customer ──▶ [2. Bus Search]     ──▶ D3: Schedules DB
Customer ──▶ [3. Seat Selection] ──▶ D4: Seats DB
Customer ──▶ [4. Booking]        ──▶ D5: Bookings DB
Customer ──▶ [5. Payment]        ──▶ D5: Bookings DB

Traveler ──▶ [6. Fleet Mgmt]     ──▶ D2: Buses DB
Traveler ──▶ [7. Schedule Mgmt]  ──▶ D3: Schedules DB
Traveler ──▶ [8. View Bookings]  ──▶ D5: Bookings DB

Admin    ──▶ [9. User Mgmt]      ──▶ D1: Users DB
Admin    ──▶ [10. Approve Trvlr] ──▶ D2: Travelers DB
Admin    ──▶ [11. Support Mgmt]  ──▶ D6: Tickets DB
```

**Figure 5.0: Data Flow Diagram – Level 1**

---

## Page 34

**Use Case Diagram:**

```
                    ┌─────────────────────────────────────┐
                    │         BusYatra System              │
  ┌──────────┐      │  ○ Register / Login                 │
  │          │──────│  ○ Search Buses                     │
  │ Customer │──────│  ○ Select Seats                     │
  │          │──────│  ○ Make Booking                     │
  └──────────┘      │  ○ View / Cancel Bookings           │
                    │  ○ Download Ticket                  │
                    │                                     │
  ┌──────────┐      │  ○ Manage Bus Fleet                 │
  │ Traveler │──────│  ○ Create Schedules                 │
  │(Operator)│──────│  ○ View Bookings & Revenue          │
  └──────────┘      │  ○ Raise Support Tickets            │
                    │                                     │
  ┌──────────┐      │  ○ Approve Travelers                │
  │  Admin   │──────│  ○ Manage Users                     │
  │          │──────│  ○ Resolve Support Tickets          │
  └──────────┘      │  ○ View Platform Statistics         │
                    └─────────────────────────────────────┘
```

**Figure 6.0: Use Case Diagram**

---

## Page 35

**Activity Diagram – Booking Flow:**

```
[Start]
   │
   ▼
[Customer Logs In]
   │
   ▼
[Search Buses: Source + Destination + Date]
   │
   ▼
[View Search Results]
   │
   ▼
[Select Bus]
   │
   ▼
[View Seat Layout]
   │
   ▼
[Select Seats]──────────────────────────────┐
   │                                        │
   ▼                                        │
[Seats Available?]──No──▶[Show Unavailable]─┘
   │ Yes
   ▼
[Lock Seats (5 min timeout)]
   │
   ▼
[Enter Passenger Details]
   │
   ▼
[Review Booking Summary]
   │
   ▼
[Confirm & Pay]
   │
   ▼
[Payment Successful?]──No──▶[Release Seats]──▶[Show Error]
   │ Yes
   ▼
[Create Booking Record]
   │
   ▼
[Update Seat Status → Booked]
   │
   ▼
[Send Confirmation Email/SMS]
   │
   ▼
[Display Booking Confirmation + Ticket]
   │
   ▼
[End]
```

**Figure 7.0: Activity Diagram – Booking Flow**

---

## Page 36

**Sequence Diagram – Booking Workflow:**

```
Customer   Frontend    Backend API    MongoDB     Payment GW
   │           │            │            │            │
   │──Login──▶│            │            │            │
   │           │──POST /login──▶        │            │
   │           │            │──Query──▶ │            │
   │           │            │◀──User──  │            │
   │           │◀──JWT Token─           │            │
   │           │            │            │            │
   │──Search──▶│            │            │            │
   │           │──GET /search──▶        │            │
   │           │            │──Query──▶ │            │
   │           │            │◀──Results─│            │
   │           │◀──Bus List──           │            │
   │           │            │            │            │
   │──Select──▶│            │            │            │
   │           │──POST /seats/lock──▶   │            │
   │           │            │──Lock──▶  │            │
   │           │◀──Locked────           │            │
   │           │            │            │            │
   │──Book────▶│            │            │            │
   │           │──POST /bookings──▶     │            │
   │           │            │──Create──▶│            │
   │           │            │──Init Payment──────────▶│
   │           │◀──Payment URL──────────────────────  │
   │──Pay─────────────────────────────────────────────▶│
   │           │            │◀──Webhook (success)──────│
   │           │            │──Confirm Booking──▶│    │
   │           │◀──Confirmation─         │            │
```

**Figure 8.0: Sequence Diagram – Booking Workflow**

---

## Page 37

### 4.5 FRONTEND DESIGN

#### 4.5.1 COMPONENT ARCHITECTURE

BusYatra's frontend follows a **feature-based component architecture**:

```
src/
├── components/
│   ├── common/          # Navbar, Footer, Loading, PrivateRoute
│   ├── customer/        # BusSearch, SeatSelection, MyBookings
│   ├── traveler/        # AddBus, AddSchedule, BusList, ScheduleList
│   └── admin/           # DashboardStats, UserManagement, TravelerMgmt
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── CustomerDashboard.jsx
│   ├── TravelerDashboard.jsx
│   └── AdminDashboard.jsx
├── context/
│   └── AuthContext.tsx   # Global auth state
├── services/
│   ├── api.js            # Axios instance with interceptors
│   ├── authService.js
│   ├── bookingService.js
│   └── travelerService.js
└── utils/
    ├── formatters.js
    └── validators.js
```

**Routing Strategy:**

Protected routes are implemented using a `PrivateRoute` component that checks JWT token
validity and user role before rendering the requested page. Unauthorized access redirects
to the login page.

---

## Page 38

### 4.6 SECURITY IMPLEMENTATION

**Authentication Flow:**

1. User submits credentials (email + password)
2. Backend validates credentials against MongoDB
3. Password verified using `bcrypt.compare()`
4. JWT token generated with user ID, role, and 7-day expiry
5. Token returned to frontend and stored in localStorage
6. Subsequent requests include token in `Authorization: Bearer <token>` header
7. Auth middleware validates token on every protected route

**Role-Based Access Control (RBAC):**

```javascript
// Auth Middleware
const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

// Role Middleware
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ErrorResponse('Not authorized', 403));
  }
  next();
};
```

**Input Validation:**

All API endpoints validate input using `express-validator` middleware, checking for:
- Required fields presence
- Email format validation
- Password strength requirements
- Numeric range validation (seat numbers, prices)
- ObjectId format validation for MongoDB references

---

## Page 39

### 4.7 DEPLOYMENT STRATEGY

**Production Environment Setup:**

| Component | Platform | Configuration |
|-----------|---------|--------------|
| Frontend | Vercel | Auto-deploy from GitHub main branch |
| Backend | Heroku / Railway | Node.js buildpack, env vars configured |
| Database | MongoDB Atlas | M0 free tier, IP whitelist configured |
| Static Assets | Vercel CDN | Automatic CDN distribution |

**Environment Variables (Backend):**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-secret-key>
JWT_EXPIRE=7d
FRONTEND_URL=https://busyatra.vercel.app
```

**Deployment Checklist:**
- [x] Environment variables configured in production
- [x] MongoDB Atlas IP whitelist updated
- [x] CORS configured for production frontend URL
- [x] JWT secret rotated for production
- [x] Error messages sanitized (no stack traces in production)
- [x] API rate limiting enabled
- [x] HTTPS enforced on all endpoints

**CI/CD Pipeline:**

GitHub Actions workflow triggers on push to `main` branch:
1. Run ESLint for code quality checks
2. Run unit tests
3. Build React application
4. Deploy frontend to Vercel
5. Deploy backend to Heroku/Railway

---

**End of Chapter 4 (Pages 25–39)**
