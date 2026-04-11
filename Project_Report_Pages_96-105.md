# BusYatra - Bus Booking & Reservation System
## Final Year Project Report (Pages 96-105)

---

## Page 96: CHAPTER 5 (Continued)

**Phase 3: Backend Development (Weeks 4-6)**
- Express.js server setup and configuration
- RESTful API endpoint implementation
- MongoDB database connection and schema creation
- Authentication middleware with JWT
- Business logic implementation
- Error handling and validation
- API documentation with Postman

**Phase 4: Frontend Development (Weeks 5-8)**
- React project setup with Vite
- Component architecture design
- Tailwind CSS integration
- Routing implementation with React Router
- State management setup
- API integration with Axios
- Form handling and validation
- Responsive design implementation

**Phase 5: Integration & Testing (Weeks 9-10)**
- Frontend-backend integration
- End-to-end workflow testing
- Bug identification and fixing
- Performance optimization
- Security testing
- User acceptance testing

---

## Page 97: CHAPTER 5 (Continued)

**Phase 6: Deployment (Weeks 11-12)**
- Production environment setup
- Database migration to MongoDB Atlas
- Backend deployment to Heroku/Railway
- Frontend deployment to Vercel/Netlify
- Environment configuration
- SSL certificate setup
- Performance monitoring
- Documentation finalization

**Iterative Development:**

Each phase involved iterative cycles of development, testing, and refinement:
- Daily code commits to Git repository
- Regular code reviews and refactoring
- Continuous integration of new features
- Immediate bug fixes and improvements
- Documentation updates alongside development

**Collaborative Approach:**

Although developed individually during internship, the project followed industry best practices:
- Version control with Git and GitHub
- Feature branch workflow
- Meaningful commit messages
- Code documentation and comments
- API documentation for future collaboration

---

## Page 98: CHAPTER 5 (Continued)

### 5.2 DATABASE STRUCTURE DESIGN

The **BusYatra: Bus Booking & Reservation System** uses MongoDB, a NoSQL document database, for flexible and scalable data storage. The database structure is designed to efficiently handle relationships between users, buses, schedules, bookings, and other entities.

#### 5.2.1 DATABASE SCHEMA OVERVIEW

**User Collection:**

Stores information about all system users (customers, travelers, admins).

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed with bcrypt),
  phone: String,
  role: String (enum: ['customer', 'traveler', 'admin']),
  isActive: Boolean,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Key Features:**
- Email indexed for fast lookup during login
- Password hashed for security
- Role-based access control
- Soft delete capability with isActive flag

---

## Page 99: CHAPTER 5 (Continued)

**Traveler Collection:**

Stores additional information specific to bus operators.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  businessName: String,
  businessLicense: String,
  address: String,
  city: String,
  state: String,
  approvalStatus: String (enum: ['pending', 'approved', 'rejected']),
  documents: [String], // URLs to uploaded documents
  rating: Number,
  totalTrips: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Bus Collection:**

Stores bus fleet information for each traveler.

```javascript
{
  _id: ObjectId,
  travelerId: ObjectId (ref: 'Traveler'),
  registrationNumber: String (unique),
  busType: String (enum: ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper']),
  totalSeats: Number,
  seatLayout: {
    rows: Number,
    columns: Number,
    seatConfiguration: [
      {
        seatNumber: String,
        type: String (enum: ['window', 'aisle', 'middle']),
        price: Number
      }
    ]
  },
  amenities: [String],
  images: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Page 100: CHAPTER 5 (Continued)

**BusSchedule Collection:**

Manages bus schedules and routes.

```javascript
{
  _id: ObjectId,
  busId: ObjectId (ref: 'Bus'),
  travelerId: ObjectId (ref: 'Traveler'),
  route: {
    source: String,
    destination: String,
    stops: [String]
  },
  departureTime: String,
  arrivalTime: String,
  duration: Number, // in minutes
  baseFare: Number,
  operatingDays: [String], // ['Monday', 'Tuesday', ...]
  validFrom: Date,
  validUntil: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Booking Collection:**

Stores all booking transactions.

```javascript
{
  _id: ObjectId,
  bookingId: String (unique, auto-generated),
  userId: ObjectId (ref: 'User'),
  scheduleId: ObjectId (ref: 'BusSchedule'),
  busId: ObjectId (ref: 'Bus'),
  journeyDate: Date,
  passengers: [
    {
      name: String,
      age: Number,
      gender: String,
      seatNumber: String
    }
  ],
  totalSeats: Number,
  totalAmount: Number,
  bookingStatus: String (enum: ['pending', 'confirmed', 'cancelled']),
  paymentStatus: String (enum: ['pending', 'completed', 'failed', 'refunded']),
  paymentId: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Page 101: CHAPTER 5 (Continued)

**Seat Collection:**

Tracks seat availability for each schedule and date.

```javascript
{
  _id: ObjectId,
  scheduleId: ObjectId (ref: 'BusSchedule'),
  journeyDate: Date,
  seats: [
    {
      seatNumber: String,
      status: String (enum: ['available', 'booked', 'locked']),
      bookingId: ObjectId (ref: 'Booking'),
      lockedUntil: Date // for temporary seat locking
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**SupportTicket Collection:**

Manages customer support queries.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  bookingId: ObjectId (ref: 'Booking'),
  subject: String,
  description: String,
  status: String (enum: ['open', 'in-progress', 'resolved', 'closed']),
  priority: String (enum: ['low', 'medium', 'high']),
  responses: [
    {
      responderId: ObjectId (ref: 'User'),
      message: String,
      timestamp: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Page 102: CHAPTER 5 (Continued)

#### 5.2.2 DATABASE RELATIONSHIPS

**One-to-One Relationships:**
- User → Traveler (one user can have one traveler profile)

**One-to-Many Relationships:**
- Traveler → Bus (one traveler can own multiple buses)
- Bus → BusSchedule (one bus can have multiple schedules)
- User → Booking (one user can make multiple bookings)
- BusSchedule → Seat (one schedule has seat availability for multiple dates)

**Many-to-Many Relationships:**
- Handled through embedded documents or reference arrays
- Example: Bookings reference both users and schedules

#### 5.2.3 INDEXING STRATEGY

To optimize query performance, the following indexes are created:

**User Collection:**
- email (unique index)
- role (for role-based queries)

**Bus Collection:**
- travelerId (for traveler's bus queries)
- registrationNumber (unique index)

**BusSchedule Collection:**
- busId, travelerId (compound index)
- route.source, route.destination (compound index for search)

**Booking Collection:**
- userId (for user's booking history)
- bookingId (unique index)
- scheduleId, journeyDate (compound index)

---

## Page 103: CHAPTER 5 (Continued)

**Seat Collection:**
- scheduleId, journeyDate (compound unique index)

#### 5.2.4 DATA INTEGRITY & VALIDATION

**Schema Validation:**

Mongoose schemas enforce data validation:
- Required fields validation
- Data type validation
- Enum validation for status fields
- Custom validators for email, phone formats
- Min/max value validation for numbers

**Referential Integrity:**

MongoDB references maintain relationships:
- Foreign key references using ObjectId
- Cascade delete operations where appropriate
- Orphan document prevention

**Transaction Support:**

For critical operations requiring atomicity:
- Booking creation with seat locking
- Payment processing with booking confirmation
- Cancellation with refund processing

### 5.3 UML DIAGRAMS

The following UML diagrams illustrate the system architecture and workflows:

---

## Page 104: CHAPTER 5 (Continued)

#### 5.3.1 USE CASE DIAGRAM

The Use Case Diagram shows interactions between different actors and the system:

**Actors:**
- Customer
- Traveler/Bus Operator
- Admin

**Customer Use Cases:**
- Register/Login
- Search Buses
- Select Seats
- Make Payment
- View Bookings
- Cancel Booking
- Download Ticket
- Submit Support Ticket

**Traveler Use Cases:**
- Register/Login
- Manage Bus Fleet
- Create Schedules
- View Bookings
- Track Revenue
- Respond to Queries

**Admin Use Cases:**
- Login
- Approve Travelers
- Manage Users
- View System Statistics
- Handle Support Tickets
- Generate Reports

---

## Page 105: CHAPTER 5 (Continued)

#### 5.3.2 ACTIVITY DIAGRAM

The Activity Diagram illustrates the booking workflow:

**Booking Process Flow:**

1. **Start** → Customer logs in
2. **Search Buses** → Enter source, destination, date
3. **View Results** → System displays available buses
4. **Apply Filters** → Optional filtering and sorting
5. **Select Bus** → Choose desired bus
6. **View Seat Layout** → Display seat availability
7. **Select Seats** → Choose one or more seats
8. **Decision Point:** Seats available?
   - **Yes** → Lock seats temporarily (5 minutes)
   - **No** → Return to seat selection
9. **Enter Passenger Details** → Fill passenger information
10. **Review Booking** → Verify details and total amount
11. **Proceed to Payment** → Redirect to payment gateway
12. **Process Payment** → Payment gateway processes transaction
13. **Decision Point:** Payment successful?
    - **Yes** → Confirm booking, generate ticket, send notifications
    - **No** → Release seats, show error message
14. **End** → Display booking confirmation

**Parallel Activities:**
- Email notification sent
- SMS notification sent
- Seat status updated in database
- Booking record created

---

**End of Pages 96-105**
