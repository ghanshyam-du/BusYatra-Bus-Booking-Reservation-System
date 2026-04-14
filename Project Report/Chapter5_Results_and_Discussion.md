# BusYatra - Bus Booking & Reservation System
## Chapter 5: Observations, Results and Discussion (Pages 40–44)

---

## Page 40

# CHAPTER 5: OBSERVATIONS, RESULTS AND DISCUSSION

### 5.1 SYSTEM IMPLEMENTATION OUTCOMES

The **BusYatra: Bus Booking & Reservation System** was successfully implemented and
deployed as a fully functional full-stack web application. All planned features were delivered
within the 13-week internship period. The following outcomes were observed:

**1. Enhanced Operational Efficiency:**

The implementation of BusYatra automates the bus ticket booking process, eliminating the
need for manual counter bookings and phone reservations. Key efficiency gains include:
- Booking confirmation time reduced from 10–15 minutes (counter) to under 30 seconds
- Automated seat generation eliminates manual seat configuration for operators
- Real-time seat availability prevents double bookings entirely
- Automated email notifications reduce manual communication overhead

**2. Improved User Experience:**

The React.js frontend with Tailwind CSS delivers a modern, responsive interface:
- Visual seat selection grid provides intuitive seat choice
- Mobile-first design ensures consistent experience on all devices
- Loading states and error messages provide clear user feedback
- Role-specific dashboards reduce cognitive load for each user type

**3. Increased Accessibility:**

The web-based deployment on Vercel/Heroku ensures:
- 24/7 availability without dependency on office hours
- Accessible from any device with internet connectivity
- No software installation required for end users
- Consistent performance across geographic locations

---

## Page 41

### 5.2 FEATURE-WISE RESULTS

**Customer Dashboard – Screenshots and Observations:**

| Feature | Status | Observation |
|---------|--------|-------------|
| User Registration/Login | ✓ Implemented | JWT token generated, role assigned correctly |
| Bus Search | ✓ Implemented | Results filtered by source, destination, date |
| Seat Selection (Visual Grid) | ✓ Implemented | 40 seats displayed, available/booked color-coded |
| Multi-seat Booking (up to 6) | ✓ Implemented | Passenger details collected per seat |
| Booking Confirmation | ✓ Implemented | Unique booking ID generated |
| My Bookings | ✓ Implemented | All bookings listed with status |
| Booking Cancellation | ✓ Implemented | Status updated, seats released |

**Figure 10.0: Customer Dashboard – Screenshot**
*(Dashboard showing bus search, seat selection, and booking history)*

**Traveler Dashboard – Screenshots and Observations:**

| Feature | Status | Observation |
|---------|--------|-------------|
| Add/Edit/Delete Bus | ✓ Implemented | Bus details saved with seat configuration |
| Create Schedule | ✓ Implemented | 40 seats auto-generated on schedule creation |
| View Bookings | ✓ Implemented | All bookings for traveler's buses listed |
| Revenue Analytics | ✓ Implemented | Total revenue, booking count displayed |
| Support Tickets | ✓ Implemented | Tickets created and tracked |

**Figure 11.0: Traveler Dashboard – Screenshot**
*(Dashboard showing bus fleet, schedule management, and booking analytics)*

---

## Page 42

**Admin Dashboard – Screenshots and Observations:**

| Feature | Status | Observation |
|---------|--------|-------------|
| User Management | ✓ Implemented | All users listed, activate/deactivate working |
| Traveler Onboarding | ✓ Implemented | Approve/reject traveler requests |
| Platform Statistics | ✓ Implemented | Total users, bookings, revenue displayed |
| Support Ticket Management | ✓ Implemented | All tickets visible, status updatable |

**Figure 12.0: Admin Dashboard – Screenshot**
*(Dashboard showing platform statistics and management tools)*

**Bus Search Results:**

The bus search feature successfully filters schedules based on:
- Source city (case-insensitive regex match)
- Destination city (case-insensitive regex match)
- Journey date (date range query)
- Active status (only active schedules shown)

**Figure 13.0: Bus Search Results – Screenshot**
*(Search results showing available buses with fare, timing, and seat availability)*

**Seat Selection Interface:**

The visual seat selection grid displays:
- 40 seats arranged in rows and columns
- Color coding: Green (available), Red (booked), Blue (selected)
- Seat type labels (Window/Aisle/Sleeper)
- Real-time update when seats are selected

**Figure 14.0: Seat Selection Interface – Screenshot**
*(Visual seat grid with color-coded availability)*

---

## Page 43

### 5.3 PERFORMANCE ANALYSIS

**API Response Time Testing (Postman):**

| Endpoint | Method | Avg Response Time | Status |
|---------|--------|------------------|--------|
| POST /api/auth/login | POST | 180ms | ✓ Pass |
| GET /api/schedules/search | GET | 220ms | ✓ Pass |
| GET /api/seats/:scheduleId | GET | 150ms | ✓ Pass |
| POST /api/bookings | POST | 310ms | ✓ Pass |
| GET /api/bookings/my | GET | 190ms | ✓ Pass |
| POST /api/buses | POST | 160ms | ✓ Pass |
| GET /api/admin/stats | GET | 280ms | ✓ Pass |

All API endpoints respond within the target threshold of 500ms.

**Figure 16.0: API Response Time Graph**
*(Bar chart showing response times for key endpoints)*

**Test Cases – API Testing (Postman):**

| Test No | Description | Expected | Actual | Status |
|---------|-------------|----------|--------|--------|
| TC-01 | User Registration | 201 Created + JWT | 201 Created + JWT | ✓ Pass |
| TC-02 | Login with wrong password | 401 Unauthorized | 401 Unauthorized | ✓ Pass |
| TC-03 | Bus Search (valid route) | 200 + schedule list | 200 + schedule list | ✓ Pass |
| TC-04 | Create Booking | 201 + booking ID | 201 + booking ID | ✓ Pass |
| TC-05 | Cancel Booking | 200 + status updated | 200 + status updated | ✓ Pass |
| TC-06 | Access admin route as customer | 403 Forbidden | 403 Forbidden | ✓ Pass |
| TC-07 | Create schedule (auto-seat gen) | 201 + 40 seats | 201 + 40 seats | ✓ Pass |
| TC-08 | Approve traveler (admin) | 200 + status approved | 200 + status approved | ✓ Pass |

**Figure 17.0: Booking Flow – Postman API Test**

---

## Page 44

### 5.4 COMPARATIVE ANALYSIS

**BusYatra vs. Traditional Booking Methods:**

| Criteria | Traditional Counter | Phone Booking | BusYatra |
|----------|--------------------|--------------|---------| 
| Booking Time | 10–15 min | 5–10 min | < 30 sec |
| Availability | Office hours only | Office hours only | 24/7 |
| Double Booking Risk | High | High | None (transactions) |
| Seat Selection | Limited | None | Visual grid |
| Confirmation | Paper ticket | Verbal | Instant digital |
| Cancellation | In-person | Phone | Online, instant |
| Operator Analytics | Manual reports | None | Real-time dashboard |

**Cost-Benefit Analysis:**

BusYatra leverages open-source technologies (Node.js, React.js, MongoDB), making it a
cost-effective solution:
- **Development Cost**: Minimal (open-source stack, free tiers for deployment)
- **Operational Cost**: ~₹1,500–2,000/month for production hosting
- **ROI**: Significant — eliminates manual booking overhead, reduces errors, enables
  24/7 revenue generation for operators

### 5.5 DISCUSSION

The BusYatra system successfully demonstrates that a modern, full-stack web application
can effectively digitize bus ticket booking for both customers and operators. The MERN
stack proved to be an excellent choice — Node.js handled concurrent API requests
efficiently, MongoDB's flexible schema accommodated varying bus configurations, and
React.js delivered a responsive, interactive UI.

The automated seat generation feature (40 seats per schedule) was particularly impactful,
eliminating a significant manual overhead for operators. The MongoDB transaction-based
booking flow successfully prevented double bookings in all test scenarios.

Looking ahead, integrating a real-time payment gateway (Razorpay/Stripe), GPS bus
tracking, and a React Native mobile app would significantly enhance the platform's
commercial viability and user adoption.

---

**End of Chapter 5 (Pages 40–44)**
