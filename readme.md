# 🚌 BusYatra - Online Bus Ticket Booking and Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

**BusYatra** is a comprehensive web-based bus ticket booking and management platform designed to simplify intercity bus travel in India. The system connects three key stakeholders: Customers who book tickets, Travelers (Bus Operators) who manage buses and schedules, and Administrators who ensure smooth operations.

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Proposed Solution](#proposed-solution)
4. [SDLC Methodology](#sdlc-methodology)
5. [System Architecture](#system-architecture)
6. [Technology Stack](#technology-stack)
7. [Database Design](#database-design)
8. [API Endpoints](#api-endpoints)
9. [Features](#features)
10. [Installation & Setup](#installation--setup)
11. [Project Structure](#project-structure)
12. [User Roles](#user-roles)
13. [Screenshots](#screenshots)
14. [Testing](#testing)
15. [Deployment](#deployment)
16. [Future Enhancements](#future-enhancements)
17. [Contributors](#contributors)
18. [License](#license)

---

## 🎯 Project Overview

### Introduction

BusYatra is an end-to-end bus booking platform that digitizes the entire bus ticket booking lifecycle. The platform provides a seamless experience for customers to search, book, and manage their bus journeys while enabling bus operators to efficiently manage their fleet, schedules, and bookings. Administrators oversee the platform, onboard new operators, and resolve support queries.

### Project Context

- **Domain:** Transportation & Travel
- **Type:** Full-Stack Web Application
- **Development Period:** January 2026
- **Project Status:** Development Phase
- **Target Users:** Indian intercity bus travelers and bus operators

### Key Objectives

1. Simplify the bus ticket booking process for customers
2. Provide bus operators with efficient fleet and schedule management tools
3. Enable administrators to manage the platform and provide support
4. Ensure data security and transaction integrity
5. Deliver a responsive, mobile-friendly user experience

---

## 🔍 Problem Statement

Traditional bus booking systems face several challenges:

### Current Pain Points

1. **Lack of Transparency**
   - Customers cannot view real-time seat availability
   - Pricing information is inconsistent across platforms
   - Limited visibility into bus operator credentials

2. **Manual Errors**
   - Double bookings due to lack of real-time synchronization
   - Human errors in seat allocation
   - Inconsistent fare calculations

3. **Poor Support Handling**
   - No centralized system for customer complaints
   - Delayed resolution of booking issues
   - Lack of communication between operators and customers

4. **Inefficient Bus Management**
   - Bus operators struggle with schedule management
   - No automated seat generation for new routes
   - Difficulty tracking bookings and revenue

5. **Limited Digital Presence**
   - Many bus operators lack online booking capabilities
   - Manual ticket booking at physical counters
   - No integration with modern payment systems

---

## ✅ Proposed Solution

BusYatra addresses these challenges through:

### Core Solutions

1. **Real-time Seat Availability**
   - Interactive seat selection with visual layout
   - Instant booking confirmation
   - Prevention of double bookings through database transactions

2. **Automated Schedule Management**
   - Auto-generation of 40 seats per bus schedule
   - Intelligent seat type assignment (SLEEPER/SEATER)
   - Dynamic availability tracking

3. **Role-Based Access Control**
   - Separate dashboards for Customers, Travelers, and Admins
   - Secure authentication with JWT tokens
   - Granular permission management

4. **Centralized Support System**
   - Ticket-based support for travelers
   - Admin dashboard for ticket resolution
   - Status tracking and notifications

5. **Comprehensive Booking Management**
   - Complete booking lifecycle (search → book → confirm → cancel)
   - Digital ticket generation with QR codes
   - Automated refund processing

---

## 🔄 SDLC Methodology

### Waterfall Model

BusYatra follows the **Waterfall Software Development Life Cycle (SDLC)** model, where each phase is completed sequentially before moving to the next.

### SDLC Phases

```
Phase 1: Requirement Analysis
    ↓
Phase 2: System Design
    ↓
Phase 3: Implementation
    ↓
Phase 4: Testing
    ↓
Phase 5: Deployment
    ↓
Phase 6: Maintenance
```

---

## 📋 Phase 1: Requirement Analysis

### 1.1 Stakeholders

| Role | Description | Count |
|------|-------------|-------|
| **Customers** | End-users who book bus tickets | Primary Users |
| **Travelers** | Bus operators who manage buses and schedules | Secondary Users |
| **Administrators** | System admins who manage the platform | Tertiary Users |

### 1.2 Functional Requirements

#### Customer Requirements
- ✅ User registration and authentication
- ✅ Search buses by route (from, to, date)
- ✅ View available buses with details
- ✅ Interactive seat selection
- ✅ Book multiple seats (max 6 per booking)
- ✅ View booking history (upcoming and past)
- ✅ Cancel bookings with refund
- ✅ Download/print digital tickets
- ✅ Update profile information
- ✅ Change password

#### Traveler Requirements
- ✅ Add and manage buses (CRUD operations)
- ✅ Create schedules with auto-seat generation
- ✅ View all bookings for owned buses
- ✅ Track revenue and booking statistics
- ✅ Create support tickets for issues
- ✅ Update bus fares and amenities
- ✅ Cancel schedules (if no bookings)

#### Administrator Requirements
- ✅ Onboard new travelers (upgrade user role)
- ✅ Approve/reject traveler applications
- ✅ View all users, buses, and bookings
- ✅ Manage support tickets
- ✅ Assign tickets to support staff
- ✅ Generate system reports
- ✅ Monitor platform activity

### 1.3 Non-Functional Requirements

| Category | Requirement | Target |
|----------|-------------|--------|
| **Performance** | API response time | < 500ms |
| **Scalability** | Concurrent users | 10,000+ |
| **Security** | Password encryption | bcrypt (10 rounds) |
| **Availability** | System uptime | 99.9% |
| **Reliability** | Transaction success rate | 99.5% |
| **Usability** | Mobile responsiveness | All devices |

---

## 🏗️ Phase 2: System Design

### 2.1 High-Level Design (HLD)

#### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Customer   │  │   Traveler   │  │    Admin     │ │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                           ↕ HTTPS
┌─────────────────────────────────────────────────────────┐
│                 APPLICATION LAYER (API)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │     Auth     │  │   Booking    │  │   Traveler   │ │
│  │   Routes     │  │    Routes    │  │    Routes    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │        Middleware (Auth, Error Handling)         │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                        │
│              MongoDB Atlas (Cloud Database)             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│  │Users │ │Buses │ │Seats │ │Books │ │Tcks  │        │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘        │
└─────────────────────────────────────────────────────────┘
```

#### Component Diagram

```
┌─────────────────────────────────────────────────────┐
│              Frontend (React.js)                    │
│  • Landing Page         • Dashboards                │
│  • Search & Booking     • Profile Management        │
│  • Seat Selection       • Admin Panel               │
└─────────────────────────────────────────────────────┘
                      ↕ REST API
┌─────────────────────────────────────────────────────┐
│           Backend (Node.js + Express)               │
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │   Controllers    │  │   Middleware     │        │
│  │ • authController │  │ • protect        │        │
│  │ • bookingCtrl    │  │ • authorize      │        │
│  │ • travelerCtrl   │  │ • errorHandler   │        │
│  └──────────────────┘  └──────────────────┘        │
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │     Models       │  │     Utils        │        │
│  │ • User.js        │  │ • asyncHandler   │        │
│  │ • Booking.js     │  │ • errorResponse  │        │
│  │ • Seat.js        │  │ • sendToken      │        │
│  └──────────────────┘  └──────────────────┘        │
└─────────────────────────────────────────────────────┘
                      ↕ Mongoose ODM
┌─────────────────────────────────────────────────────┐
│              MongoDB Database                       │
│  Collections: users, travelers, admins, buses,      │
│  busschedules, seats, bookings, bookingseats,       │
│  supporttickets                                     │
└─────────────────────────────────────────────────────┘
```

### 2.2 Low-Level Design (LLD)

#### Entity Relationship Diagram

```
┌──────────────┐
│     USER     │
│──────────────│
│ user_id (PK) │───┐
│ email        │   │
│ role         │   │
│ password     │   │
└──────────────┘   │
                   │ 1:1
      ┌────────────┴───────────┬──────────────┐
      │                        │              │
      ↓ 1:1                    ↓ 1:1          ↓ 1:N
┌─────────────┐          ┌──────────┐   ┌──────────┐
│  TRAVELER   │          │  ADMIN   │   │ BOOKING  │
│─────────────│          │──────────│   │──────────│
│traveler_id  │          │ admin_id │   │booking_id│
│company_name │          │dept      │   │user_id   │
└─────────────┘          └──────────┘   │schedule  │
      │ 1:N                    │ 1:N     └──────────┘
      ↓                        ↓              │ 1:N
┌──────────┐           ┌──────────────┐      ↓
│   BUS    │           │SUPPORT TICKET│ ┌──────────────┐
│──────────│           │──────────────│ │ BOOKING_SEAT │
│ bus_id   │           │ ticket_id    │ │──────────────│
│traveler  │           │ traveler_id  │ │booking_id    │
│from/to   │           │ admin_id     │ │seat_id       │
└──────────┘           └──────────────┘ │passenger info│
      │ 1:N                              └──────────────┘
      ↓                                        ↑
┌──────────────┐                              │
│ BUS_SCHEDULE │ ⭐ KEY ENTITY                │
│──────────────│                              │
│ schedule_id  │                              │
│ bus_id       │                              │
│ journey_date │                              │
│ avail_seats  │                              │
└──────────────┘                              │
      │ 1:N                                   │
      ↓                                       │
┌──────────┐                                  │
│   SEAT   │ ⭐ KEY ENTITY                    │
│──────────│                                  │
│ seat_id  │                                  │
│schedule  │                                  │
│is_booked │──────────────────────────────────┘
│seat_num  │
└──────────┘
```

#### Key Design Decisions

1. **No Separate Passenger Entity**
   - Customer data stored in User entity
   - Simplifies authentication and role management

2. **BusSchedule as Central Entity**
   - Same bus can have multiple schedules (different dates)
   - Each schedule has independent seat availability

3. **Seat Auto-Generation**
   - When schedule is created, 40 seats auto-generated
   - Eliminates manual seat creation
   - Ensures consistency

4. **BookingSeat Junction Table**
   - Handles many-to-many between Booking and Seat
   - Stores individual passenger details per seat

---

## 💻 Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 16+ | Runtime environment |
| **Express.js** | 4.18.2 | Web framework |
| **MongoDB** | 6.0+ | NoSQL database |
| **Mongoose** | 8.0.0 | MongoDB ODM |
| **bcryptjs** | 2.4.3 | Password hashing |
| **jsonwebtoken** | 9.0.2 | JWT authentication |
| **dotenv** | 16.3.1 | Environment variables |
| **cors** | 2.8.5 | Cross-origin resource sharing |

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React.js** | 18.2.0 | UI library |
| **Tailwind CSS** | 3.3.2 | Utility-first CSS framework |
| **Lucide React** | 0.263.1 | Icon library |
| **Axios** | 1.4.0 | HTTP client |
| **React Router** | 6.14.0 | Client-side routing |

### Development Tools

| Tool | Purpose |
|------|---------|
| **VS Code** | Code editor |
| **Postman** | API testing |
| **MongoDB Atlas** | Cloud database |
| **Git** | Version control |
| **GitHub** | Code repository |
| **Nodemon** | Development server |

### Architecture Pattern

- **Client-Server Architecture**
- **RESTful API Design**
- **MVC Pattern** (Model-View-Controller)
- **JWT-based Authentication**
- **Role-Based Access Control (RBAC)**

---

## 🗄️ Database Design

### Collections Overview

| Collection | Documents | Purpose |
|------------|-----------|---------|
| **users** | Variable | Store all user accounts |
| **travelers** | Variable | Bus operator profiles |
| **admins** | Variable | Administrator profiles |
| **buses** | Variable | Bus master data |
| **busschedules** | Variable | Journey schedules |
| **seats** | Variable | Individual seat records |
| **bookings** | Variable | Ticket bookings |
| **bookingseats** | Variable | Passenger details per seat |
| **supporttickets** | Variable | Support requests |

### Schema Details

#### User Schema
```javascript
{
  user_id: String (PK),
  full_name: String,
  email: String (Unique),
  mobile_number: String,
  password: String (Hashed),
  role: Enum ['CUSTOMER', 'TRAVELER', 'ADMIN'],
  gender: Enum ['Male', 'Female', 'Other'],
  date_of_birth: Date,
  is_active: Boolean,
  timestamps: true
}
```

#### Bus Schema
```javascript
{
  bus_id: String (PK),
  traveler_id: String (FK → Traveler),
  bus_number: String (Unique),
  bus_type: Enum ['AC Sleeper', 'Non-AC Sleeper', ...],
  from_location: String,
  to_location: String,
  total_seats: Number,
  fare: Number,
  amenities: Array[String],
  is_active: Boolean,
  timestamps: true
}
```

#### BusSchedule Schema ⭐
```javascript
{
  schedule_id: String (PK),
  bus_id: String (FK → Bus),
  journey_date: Date,
  departure_time: String,
  arrival_time: String,
  total_seats: Number,
  available_seats: Number,
  booked_seats: Number,
  schedule_status: Enum ['ACTIVE', 'CANCELLED', 'COMPLETED'],
  timestamps: true
}
```

#### Seat Schema ⭐
```javascript
{
  seat_id: String (PK),
  schedule_id: String (FK → BusSchedule),
  seat_number: String,
  seat_type: Enum ['SLEEPER', 'SEATER', 'SEMI_SLEEPER'],
  seat_position: {
    row: String,
    column: Number,
    level: Enum ['LOWER', 'UPPER']
  },
  is_booked: Boolean,
  booking_id: String (FK → Booking),
  timestamps: true
}
```

#### Booking Schema
```javascript
{
  booking_id: String (PK),
  booking_reference: String (Unique),
  user_id: String (FK → User),
  schedule_id: String (FK → BusSchedule),
  traveler_id: String (FK → Traveler),
  number_of_seats: Number,
  seat_numbers: Array[String],
  total_amount: Number,
  booking_status: Enum ['PENDING', 'CONFIRMED', 'CANCELLED'],
  payment_status: Enum ['UNPAID', 'PAID', 'REFUNDED'],
  payment_method: String,
  booking_date: Date,
  cancellation_date: Date,
  refund_amount: Number,
  timestamps: true
}
```

#### BookingSeat Schema ⭐
```javascript
{
  booking_seat_id: String (PK),
  booking_id: String (FK → Booking),
  seat_id: String (FK → Seat),
  passenger_name: String,
  passenger_age: Number,
  passenger_gender: Enum ['Male', 'Female', 'Other'],
  passenger_id_type: Enum ['Aadhar', 'PAN', 'Passport', ...],
  passenger_id_number: String,
  timestamps: true
}
```

### Indexes for Performance

```javascript
// User indexes
users: { email: 1, user_id: 1, role: 1 }

// Bus indexes
buses: { bus_id: 1, traveler_id: 1, from_location: 1, to_location: 1 }

// BusSchedule indexes (Critical for search performance)
busschedules: { 
  schedule_id: 1, 
  bus_id: 1, 
  journey_date: 1,
  { bus_id: 1, journey_date: 1 } // Compound index
}

// Seat indexes (Critical for availability check)
seats: { 
  seat_id: 1, 
  schedule_id: 1,
  { schedule_id: 1, is_booked: 1 } // Compound index
}

// Booking indexes
bookings: { booking_id: 1, booking_reference: 1, user_id: 1, schedule_id: 1 }
```

---

## 🛣️ API Endpoints

### Base URL
```
Development: http://localhost:5000/api
Production: https://api.busyatra.com/api
```

### Authentication Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | User login |
| GET | `/auth/me` | Private | Get current user |
| PUT | `/auth/updateprofile` | Private | Update profile |
| PUT | `/auth/changepassword` | Private | Change password |
| POST | `/auth/forgotpassword` | Public | Request password reset |
| PUT | `/auth/resetpassword/:token` | Public | Reset password |
| GET | `/auth/logout` | Private | Logout user |

### Booking Endpoints (Customer)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/bookings/search-buses` | Public | Search buses by route & date |
| GET | `/bookings/seats/:scheduleId` | Public | Get available seats |
| POST | `/bookings` | Customer | Create booking |
| GET | `/bookings/my-bookings` | Customer | Get user's bookings |
| GET | `/bookings/:bookingId` | Customer | Get booking details |
| PUT | `/bookings/:bookingId/cancel` | Customer | Cancel booking |

### Traveler Endpoints

#### Bus Management

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/traveler/buses` | Traveler | Add new bus |
| GET | `/traveler/buses` | Traveler | Get all my buses |
| GET | `/traveler/buses/:busId` | Traveler | Get bus details |
| PUT | `/traveler/buses/:busId` | Traveler | Update bus |
| DELETE | `/traveler/buses/:busId` | Traveler | Delete bus |

#### Schedule Management

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/traveler/schedules` | Traveler | Create schedule (auto-generates seats) |
| GET | `/traveler/schedules` | Traveler | Get all my schedules |
| PUT | `/traveler/schedules/:scheduleId` | Traveler | Update schedule |
| PUT | `/traveler/schedules/:scheduleId/cancel` | Traveler | Cancel schedule |

#### Booking & Support

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/traveler/bookings` | Traveler | View all bookings for my buses |
| POST | `/traveler/tickets` | Traveler | Create support ticket |
| GET | `/traveler/tickets` | Traveler | Get my support tickets |
| GET | `/traveler/tickets/:ticketId` | Traveler | Get ticket details |

### Admin Endpoints (To be implemented)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/admin/onboard-traveler` | Admin | Onboard new traveler |
| GET | `/admin/travelers` | Admin | Get all travelers |
| PUT | `/admin/travelers/:id/status` | Admin | Approve/reject traveler |
| GET | `/admin/tickets` | Admin | Get all support tickets |
| PUT | `/admin/tickets/:id/assign` | Admin | Assign ticket to admin |
| PUT | `/admin/tickets/:id/resolve` | Admin | Resolve ticket |
| GET | `/admin/reports` | Admin | Get system reports |

### Query Parameters

#### Search Buses
```
GET /api/bookings/search-buses?from=Mumbai&to=Pune&date=2026-01-25
```

#### Filter Bookings
```
GET /api/bookings/my-bookings?status=CONFIRMED
GET /api/traveler/bookings?date_from=2026-01-01&date_to=2026-01-31
```

#### Filter Schedules
```
GET /api/traveler/schedules?status=ACTIVE&date_from=2026-01-20
```

---

## ✨ Features

### Customer Features

#### 1. Bus Search & Booking
- **Smart Search**: Search by from/to locations and journey date
- **Advanced Filters**: Filter by bus type, price, departure time, amenities
- **Sort Options**: Sort by price, departure time, duration, rating
- **Interactive Seat Selection**: Visual grid with 40 seats
- **Multi-Seat Booking**: Book up to 6 seats in one transaction
- **Real-time Availability**: Live seat availability updates
- **Passenger Details**: Enter details for each passenger
- **Instant Confirmation**: Immediate booking confirmation with reference number

#### 2. Booking Management
- **View Bookings**: List of all bookings (upcoming, completed, cancelled)
- **Booking Details**: Complete ticket information with QR code
- **Download Ticket**: PDF download functionality
- **Cancel Booking**: Cancel with automatic refund calculation
- **Booking History**: Filter and search past bookings

#### 3. Profile Management
- **Update Profile**: Edit personal information
- **Change Password**: Secure password change
- **Saved Passengers**: Save frequent travelers

### Traveler Features

#### 1. Bus Fleet Management
- **Add Buses**: Add new buses with complete details
- **Update Buses**: Modify fare, amenities, bus type
- **View Buses**: List all owned buses
- **Delete Buses**: Soft delete (deactivate) buses
- **Bus Analytics**: View bookings and revenue per bus

#### 2. Schedule Management
- **Create Schedules**: Set journey dates and times
- **Auto-Seat Generation**: System automatically creates 40 seats
- **Update Schedules**: Modify departure/arrival times
- **Cancel Schedules**: Cancel if no active bookings
- **Schedule Calendar**: View all schedules in calendar format

#### 3. Booking Insights
- **View All Bookings**: See all bookings for owned buses
- **Revenue Tracking**: Real-time revenue statistics
- **Booking Analytics**: Confirmed vs cancelled statistics
- **Passenger Details**: View passenger information

#### 4. Support System
- **Create Tickets**: Raise technical/billing issues
- **Track Tickets**: Monitor ticket status
- **Ticket History**: View all past tickets

### Admin Features (Planned)

#### 1. Traveler Management
- **Onboard Travelers**: Upgrade user to traveler role
- **Approve Applications**: Review and approve traveler requests
- **Manage Accounts**: Activate/deactivate traveler accounts
- **Verification**: Verify business documents

#### 2. Support Management
- **View All Tickets**: See tickets from all travelers
- **Assign Tickets**: Assign to support staff
- **Resolve Tickets**: Close with resolution notes
- **Escalate Tickets**: Mark critical issues

#### 3. System Monitoring
- **User Analytics**: Track user growth
- **Booking Analytics**: Monitor booking trends
- **Revenue Reports**: Generate revenue reports
- **System Health**: Monitor API performance

---

## 🚀 Installation & Setup

### Prerequisites

```bash
Node.js >= 16.0.0
npm >= 7.0.0
MongoDB >= 6.0.0 (or MongoDB Atlas account)
Git
```

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/busyatra.git
cd busyatra/backend

# 2. Install dependencies
npm install

# 3. Create .env file
touch .env

# 4. Add environment variables to .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/busyatra_db
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development

# 5. Start development server
npm run dev

# Server will start at http://localhost:5000
```

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd ../frontend

# 2. Install dependencies
npm install

# 3. Create .env file
touch .env

# 4. Add environment variables
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development

# 5. Start development server
npm start

# Application will open at http://localhost:3000
```

### Database Setup (MongoDB Atlas)

```bash
# 1. Sign up at https://www.mongodb.com/cloud/atlas
# 2. Create a free M0 cluster
# 3. Create database user
# 4. Whitelist IP address (or allow all: 0.0.0.0/0 for development)
# 5. Get connection string
# 6. Add to .env file
```

### Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Serve the build folder using a static server
```

---

## 📁 Project Structure

```
busyatra/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── bookingController.js # Booking operations
│   │   └── travelerController.js # Traveler operations
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Traveler.js          # Traveler schema
│   │   ├── Admin.js             # Admin schema
│   │   ├── Bus.js               # Bus schema
│   │   ├── BusSchedule.js       # Schedule schema
│   │   ├── Seat.js              # Seat schema
│   │   ├── Booking.js           # Booking schema
│   │   ├── BookingSeat.js       # BookingSeat schema
│   │   └── SupportTicket.js     # Ticket schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── bookingRoutes.js     # Booking endpoints
│   │   └── travelerRoutes.js    # Traveler endpoints
│   ├── utils/
│   │   ├── asyncHandler.js      # Async wrapper
│   │   ├── errorResponse.js     # Error class
│