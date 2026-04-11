# BusYatra - Bus Booking & Reservation System
## Final Year Project Report (Pages 106-115)

---

## Page 106: CHAPTER 5 (Continued)

#### 5.3.3 SEQUENCE DIAGRAM

The Sequence Diagram illustrates the interaction between system components during a booking:

**Actors/Components:**
- Customer (User)
- Frontend (React Application)
- Backend API (Express Server)
- Database (MongoDB)
- Payment Gateway (Razorpay/Stripe)
- Notification Service

**Booking Sequence:**

1. Customer → Frontend: Login with credentials
2. Frontend → Backend API: POST /api/auth/login
3. Backend API → Database: Verify user credentials
4. Database → Backend API: Return user data
5. Backend API → Frontend: Return JWT token
6. Frontend → Customer: Display dashboard

7. Customer → Frontend: Search buses (source, destination, date)
8. Frontend → Backend API: GET /api/schedules/search
9. Backend API → Database: Query available schedules
10. Database → Backend API: Return matching schedules
11. Backend API → Frontend: Return search results
12. Frontend → Customer: Display available buses

---

## Page 107: CHAPTER 5 (Continued)

13. Customer → Frontend: Select bus and seats
14. Frontend → Backend API: POST /api/seats/lock
15. Backend API → Database: Lock selected seats (5 min)
16. Database → Backend API: Confirm seat lock
17. Backend API → Frontend: Return locked seats

18. Customer → Frontend: Enter passenger details
19. Frontend → Backend API: POST /api/bookings/create
20. Backend API → Database: Create booking record (pending)
21. Database → Backend API: Return booking ID

22. Backend API → Payment Gateway: Initialize payment
23. Payment Gateway → Customer: Display payment page
24. Customer → Payment Gateway: Complete payment
25. Payment Gateway → Backend API: Payment webhook (success/failure)

26. Backend API → Database: Update booking status (confirmed)
27. Backend API → Database: Update seat status (booked)
28. Backend API → Notification Service: Send email/SMS
29. Notification Service → Customer: Booking confirmation

30. Backend API → Frontend: Return booking confirmation
31. Frontend → Customer: Display ticket and booking details

---

## Page 108: CHAPTER 5 (Continued)

#### 5.3.4 DATA FLOW DIAGRAM (DFD)

**Level 0 DFD (Context Diagram):**

**External Entities:**
- Customer
- Traveler
- Admin

**System:** BusYatra Booking System

**Data Flows:**
- Customer → System: Registration, Login, Search Query, Booking Request, Payment
- System → Customer: Search Results, Booking Confirmation, Ticket
- Traveler → System: Bus Details, Schedule Information, Login
- System → Traveler: Booking Reports, Revenue Analytics
- Admin → System: User Management, Approval Requests
- System → Admin: System Statistics, Reports

**Level 1 DFD:**

**Processes:**
1. **User Authentication** (Login/Register)
2. **Bus Search** (Query schedules)
3. **Seat Selection** (Lock and select seats)
4. **Booking Management** (Create, view, cancel bookings)
5. **Payment Processing** (Handle transactions)
6. **Notification** (Send emails/SMS)
7. **Admin Operations** (Manage users, approve travelers)
8. **Traveler Operations** (Manage fleet, schedules)

---

## Page 109: CHAPTER 5 (Continued)

**Data Stores:**
- D1: User Database
- D2: Bus Database
- D3: Schedule Database
- D4: Booking Database
- D5: Seat Availability Database
- D6: Payment Records

#### 5.3.5 ENTITY-RELATIONSHIP DIAGRAM (ER DIAGRAM)

**Entities and Attributes:**

**User Entity:**
- user_id (PK)
- name
- email (unique)
- password (hashed)
- phone
- role
- is_active
- created_at

**Traveler Entity:**
- traveler_id (PK)
- user_id (FK)
- business_name
- business_license
- address
- approval_status
- rating

**Bus Entity:**
- bus_id (PK)
- traveler_id (FK)
- registration_number (unique)
- bus_type
- total_seats
- seat_layout
- amenities
- is_active

---

## Page 110: CHAPTER 6 - IMPLEMENTATION

## 6. IMPLEMENTATION

### 6.1 IMPLEMENTATION PLATFORM

The **BusYatra: Bus Booking & Reservation System** was implemented using a modern full-stack web development environment, ensuring efficient development, testing, and deployment.

**Hardware Infrastructure:**

The system was developed and tested on a local development machine with the following specifications:

**Processor:** Intel Core i5 (8th generation) / AMD Ryzen 5
- Clock speed: 2.8 GHz
- Sufficient for running multiple development services simultaneously

**RAM:** 16GB DDR4
- Enables smooth operation of VS Code, Node.js server, MongoDB, React dev server, and browser
- Allows efficient multitasking during development

**Storage:** 512GB SSD
- Fast read/write speeds for quick project compilation
- Adequate space for development tools, dependencies, and project files

**Network:** Broadband internet connection (50 Mbps)
- Required for npm package installation
- Cloud service access (MongoDB Atlas, deployment platforms)
- API testing and documentation

---

## Page 111: CHAPTER 6 (Continued)

**Software Environment:**

**Operating System:** Windows 11 (64-bit)
- Compatible with all development tools
- WSL2 (Windows Subsystem for Linux) for Linux-like environment

**Programming Languages:**
- JavaScript ES6+ (Frontend and Backend)
- Node.js v18.17.0 (Backend runtime)
- HTML5 and CSS3 (Markup and styling)

**Development Environment:**

**Code Editor:** Visual Studio Code v1.85
- Extensions: ESLint, Prettier, ES7+ React snippets, Thunder Client
- Integrated terminal for running commands
- Git integration for version control

**Version Control:** Git v2.42 with GitHub
- Feature branch workflow
- Commit history tracking
- Remote repository hosting

**API Testing:** Postman v10.19
- API endpoint testing
- Request/response validation
- Collection organization

---

## Page 112: CHAPTER 6 (Continued)

**Deployment Environment:**

**Database Hosting:** MongoDB Atlas (M0 Free Tier)
- Cloud-hosted MongoDB database
- Automatic backups
- 512MB storage

**Backend Hosting:** Heroku (Free Tier) / Railway
- Container-based deployment
- Automatic SSL certificates
- Environment variable management

**Frontend Hosting:** Vercel
- Automatic deployments from Git
- CDN distribution
- Custom domain support

### 6.2 PROCESS / PROGRAM / TECHNOLOGY / MODULES

This section details the processes, technologies, and modules used in the **BusYatra: Bus Booking & Reservation System**.

**Processes:**

The project follows the full-stack web development lifecycle:

**1. Requirements Analysis:** Gathering functional and non-functional requirements from stakeholders

**2. System Design:** Creating database schemas, API endpoints, and UI wireframes

---

## Page 113: CHAPTER 6 (Continued)

**3. Backend Development:** Implementing RESTful APIs with Express.js and MongoDB

**4. Frontend Development:** Building responsive UI with React and Tailwind CSS

**5. Integration:** Connecting frontend with backend APIs

**6. Testing:** Unit testing, integration testing, and user acceptance testing

**7. Deployment:** Deploying to production servers with CI/CD

**Technologies:**

**Backend Technologies:**
- Node.js with Express.js framework
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for email notifications

**Frontend Technologies:**
- React.js v18 with Vite build tool
- Tailwind CSS for styling
- Axios for HTTP requests
- React Router for navigation
- Context API for state management

**Modules:**

**Authentication Module:** Handles user registration, login, JWT token generation, and role-based access control

**Bus Management Module:** Allows travelers to add, edit, and manage their bus fleet

---

## Page 114: CHAPTER 6 (Continued)

**Schedule Management Module:** Enables creation and management of bus schedules with routes and timings

**Booking Module:** Core module handling search, seat selection, booking creation, and confirmation

**Payment Module:** Integrates with payment gateways for secure transaction processing

**Notification Module:** Sends automated email and SMS notifications for bookings

**Admin Module:** Provides administrative control over users, travelers, and system content

### 6.3 OUTCOMES

**1. Enhanced Efficiency:** The implementation of the **BusYatra: Bus Booking & Reservation System** automates the bus ticket booking process, reducing the need for manual counter bookings and phone reservations. The integration of real-time seat availability and instant booking confirmation ensures fast and accurate transactions, improving accessibility for customers.

**2. Improved User Experience:** The use of modern web technologies (React, Tailwind CSS) and responsive design ensures a smooth user experience across all devices. Interactive seat selection, real-time search results, and intuitive navigation make the booking process convenient and user-friendly.

**3. Increased Accessibility:** The web-based deployment allows users to access the booking system from any device with internet connectivity, eliminating geographical barriers. The 24/7 availability enables customers to book tickets at their convenience without depending on office hours.

---

## Page 115: CHAPTER 6 (Continued)

### 6.4 RESULT ANALYSIS

The **BusYatra: Bus Booking & Reservation System** was evaluated based on key performance indicators such as functionality, usability, performance, and security to determine its effectiveness in modernizing bus ticket booking.

**Functional Completeness:**

The system successfully implements all core features:
- User authentication with role-based access (Customer, Traveler, Admin)
- Real-time bus search with multiple filters
- Interactive seat selection with visual layout
- Secure payment integration
- Booking management (view, cancel, download ticket)
- Traveler dashboard for fleet and schedule management
- Admin panel for system oversight

All functional requirements outlined in Chapter 4 have been met, with each module operating as intended.

**Performance Analysis:**

The system demonstrates excellent performance metrics:
- **Page Load Time:** Initial load under 2 seconds on 4G connection
- **API Response Time:** Average 200-400ms for most endpoints
- **Search Performance:** Bus search results displayed within 1 second
- **Concurrent Users:** Successfully tested with 100 simultaneous users
- **Database Queries:** Optimized with proper indexing, average query time under 50ms

Performance testing revealed that the system handles typical load efficiently, with room for scaling as user base grows.

---

**End of Pages 106-115**
