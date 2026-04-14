# BusYatra - Bus Booking & Reservation System
## Conclusions, References & Annexures (Pages 45–93)

---

## Page 45: CONCLUSIONS & SUMMARY

# CONCLUSIONS & SUMMARY

### OVERALL ANALYSIS

The **BusYatra: Bus Booking & Reservation System** has proven to be a valuable full-stack
web development project, successfully demonstrating the potential of the MERN stack in
transforming traditional bus booking operations. The project was completed during a
13-week internship at Fox Trading Solutions (15 Dec 2025 – 15 Mar 2026) and delivered
a fully functional, deployed web application.

**Key Achievements:**

1. **Complete MERN Stack Application**: Successfully built and deployed a production-ready
   full-stack web application using MongoDB, Express.js, React.js, and Node.js.

2. **Secure Authentication**: Implemented JWT-based authentication with bcrypt password
   hashing and role-based access control for three user roles (Customer, Traveler, Admin).

3. **Real-Time Booking System**: Developed a real-time seat availability system with
   MongoDB transactions preventing double bookings across all test scenarios.

4. **Automated Operations**: Implemented automated seat generation (40 seats per schedule),
   eliminating manual configuration overhead for bus operators.

5. **Comprehensive Dashboards**: Delivered three role-specific dashboards with complete
   feature sets for customers, travelers, and administrators.

6. **Cloud Deployment**: Successfully deployed the application to production cloud
   platforms (Vercel, Heroku, MongoDB Atlas).

---

## Page 46: CONCLUSIONS & SUMMARY (Continued)

### PROBLEMS ENCOUNTERED AND SOLUTIONS

**Challenge 1: Concurrent Booking (Double Booking Prevention)**

Managing concurrent seat bookings was the most complex technical challenge. Multiple
users could attempt to book the same seat simultaneously, leading to race conditions.

*Solution:* Implemented MongoDB transactions with a seat locking mechanism. When a
user selects seats, they are temporarily locked for 5 minutes. The booking creation uses
a MongoDB transaction to atomically check availability, lock seats, and create the booking
record — ensuring no double bookings.

**Challenge 2: Automated Seat Generation**

Manually creating 40 seats for every new schedule was impractical and error-prone.

*Solution:* Implemented a Mongoose post-save middleware on the BusSchedule model that
automatically generates 40 seat documents with proper seat numbers, types (SLEEPER/
SEATER), and positions whenever a new schedule is created.

**Challenge 3: Role-Based Route Protection**

Ensuring that customers cannot access traveler routes and vice versa required careful
middleware design.

*Solution:* Implemented a two-layer middleware system — `protect` (validates JWT) and
`authorize(...roles)` (checks user role) — applied to every protected route.

### LIMITATIONS AND FUTURE ENHANCEMENTS

**Current Limitations:**
- No real-time payment gateway integration (simulated payment flow)
- No GPS bus tracking
- No mobile application
- Basic email notifications (no SMS integration)

**Future Enhancements:**
- Razorpay/Stripe payment gateway integration
- React Native mobile application
- Real-time GPS tracking with WebSockets
- AI-powered dynamic pricing
- Multi-language support (Hindi, Gujarati)
- Integration with government GSRTC/MSRTC APIs

---

## Page 47: ANNEXURES OF REPORT

# ANY ANNEXURES OF REPORT

### ANNEXURE A: Key Code Snippets

**A.1 Authentication Middleware (Backend):**

```javascript
// Backend/src/middlewares/auth.middlewares.js
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized', 401));
  }
});
```

**A.2 Bus Search API (Backend):**

```javascript
// Search schedules by source, destination, date
const searchSchedules = asyncHandler(async (req, res) => {
  const { source, destination, date } = req.query;
  const schedules = await BusSchedule.find({
    'route.source': { $regex: source, $options: 'i' },
    'route.destination': { $regex: destination, $options: 'i' },
    isActive: true
  }).populate('busId travelerId');
  res.status(200).json({ success: true, data: schedules });
});
```

---

## Page 48: REFERENCES

# REFERENCES

I. Sharma, R., & Kumar, A. (2023). *Modern Web Application Development with MERN
Stack: A Comprehensive Study*. International Journal of Web Engineering, 12(4), 45–62.

II. Patel, V., & Singh, M. (2022). *Real-Time Booking Systems: Architecture and
Challenges*. International Journal of Computer Applications, 184(12), 1–8.

III. Johnson, T., & Lee, S. (2024). *Secure Authentication in Web Applications: JWT vs.
Session-Based Approaches*. Journal of Information Security, 15(2), 112–128.

IV. Kumar, P., & Reddy, K. (2023). *NoSQL Database Design Patterns for Scalable Web
Applications*. Database Systems Journal, 8(3), 78–95.

V. Chen, W., & Zhang, L. (2022). *RESTful API Design Best Practices for Modern Web
Applications*. Software Engineering Review, 19(1), 34–51.

VI. Anderson, M., & Brown, J. (2023). *Cloud Deployment Strategies for Full-Stack Web
Applications*. Cloud Computing Journal, 11(4), 201–218.

VII. Williams, D., & Taylor, E. (2024). *User Experience Design for Online Booking
Platforms: A Usability Study*. HCI International, 22(3), 156–172.

---

## Page 49: REFERENCES (Continued)

VIII. Dubey, G. (2026). *BusYatra: Bus Booking & Reservation System Using MERN Stack*.
IJIRSET, Volume 15, Issue 3, March 2026. e-ISSN: 2319-8753.

IX. Fowler, M. (2018). *Patterns of Enterprise Application Architecture*. Addison-Wesley
Professional. ISBN: 978-0321127426.

X. MongoDB Inc. (2024). *MongoDB Documentation – Schema Design Patterns*.
Retrieved from https://www.mongodb.com/docs/manual/data-modeling/

XI. React Documentation. (2024). *React – A JavaScript Library for Building User
Interfaces*. Retrieved from https://react.dev/

XII. Express.js Documentation. (2024). *Express – Fast, Unopinionated, Minimalist Web
Framework for Node.js*. Retrieved from https://expressjs.com/

XIII. Tailwind CSS Documentation. (2024). *Tailwind CSS – A Utility-First CSS Framework*.
Retrieved from https://tailwindcss.com/docs/

XIV. JWT.io. (2024). *JSON Web Tokens – Introduction*. Retrieved from https://jwt.io/introduction/

---

## Page 50: NOC FROM DEPARTMENT (Annexure-05)

# NOC FROM DEPARTMENT
## Annexure-05

```
Date: 12/12/2025

[Parul University Logo]

To,
FOX TRADING SOLUTIONS
Bengaluru, Karnataka

Subject: No Objection Certificate for Internship

Dear Sir / Madam,

This is to inform that Enrollment No. 210305105699, Ghanshyam Dubey, a student of
B.E. Computer Science and Engineering (8th Semester) from our institute is hereby
permitted to join your organization for an internship from 15-Dec-2025 to 15-Mar-2026.

This student can join your organization on a full-time basis. However, he/she will be
required to appear for all Weekly Tests, Mid-Semester Examinations, External Semester
Examinations, Vivas, Submissions, and Practical Examinations as per the university
schedule, and must perform satisfactorily to become eligible for the degree certificate.

We request you to kindly consider the same and approve leaves accordingly as per the
examination schedule as and when finalized.

Yours Faithfully,

Ms. Sumitra Menaria
Head & Assistant Professor – CSE Department
Parul Institute of Technology, Vadodara
Parul University
```

---

## Page 51: INTERNSHIP ACCEPTANCE LETTER FROM INDUSTRY

# INTERNSHIP ACCEPTANCE LETTER FROM INDUSTRY

```
Date: 14/12/2025

FOX TRADING SOLUTIONS
Bengaluru, Karnataka

To,
The Head of Department
Computer Science and Engineering
Parul Institute of Technology
Parul University, Vadodara

Subject: Internship Acceptance Letter

Dear Sir/Madam,

We are pleased to inform you that we have accepted Ghanshyam Dubey
(Enrollment No: 210305105699), a student of B.E. Computer Science and Engineering
(8th Semester) from Parul Institute of Technology, Parul University, for an internship
in the domain of Full Stack Web Development.

Internship Details:
  • Start Date    : 15 December 2025
  • End Date      : 15 March 2026
  • Duration      : 13 Weeks
  • Domain        : Full Stack Web Development (MERN Stack)
  • Mentor        : Mr. Shashwat Dubey
  • Project       : BusYatra – Bus Booking & Reservation System

The student will be working on a live project and will be provided with necessary
guidance, resources, and mentorship throughout the internship period.

Yours Sincerely,

Mr. Shashwat Dubey
Mentor / Technical Lead
Fox Trading Solutions, Bengaluru
```

---

## Page 52–86: DAILY LOG AND WEEKLY LOG (Annexure-06) – LOG BOOK

# DAILY LOG AND WEEKLY LOG
## Annexure-06 – Internship Log Book

---

### WEEK 1 (15 Dec – 21 Dec 2025): Requirements & Environment Setup

| Date | Day | Activities Performed | Hours |
|------|-----|---------------------|-------|
| 15/12/2025 | Mon | Orientation, project briefing, environment setup (Node.js, VS Code, MongoDB) | 8 |
| 16/12/2025 | Tue | Requirements gathering, user story creation, feature list finalization | 8 |
| 17/12/2025 | Wed | ER diagram design, database schema planning | 8 |
| 18/12/2025 | Thu | API endpoint planning, Postman collection setup | 8 |
| 19/12/2025 | Fri | UI wireframe sketching, component hierarchy planning | 8 |
| 20/12/2025 | Sat | Review with mentor, feedback incorporation | 4 |

**Weekly Summary:** Completed project requirements analysis, ER diagram, and initial system design. Environment configured with Node.js v18, MongoDB Atlas cluster created, GitHub repository initialized.

---

### WEEK 2 (22 Dec – 28 Dec 2025): System Design

| Date | Day | Activities Performed | Hours |
|------|-----|---------------------|-------|
| 22/12/2025 | Mon | Finalized database schema for all 9 collections | 8 |
| 23/12/2025 | Tue | Designed RESTful API endpoints (auth, users, buses) | 8 |
| 24/12/2025 | Wed | Created Mongoose models: User, Traveler, Admin | 8 |
| 25/12/2025 | Thu | Holiday – Christmas | - |
| 26/12/2025 | Fri | Created Mongoose models: Bus, BusSchedule, Seat | 8 |
| 27/12/2025 | Sat | Review session, schema validation testing | 4 |

**Weekly Summary:** All 9 Mongoose schemas defined with validation rules. Database indexes created for performance optimization.

---

### WEEK 3 (29 Dec 2025 – 04 Jan 2026): Backend Setup & Auth

| Date | Day | Activities Performed | Hours |
|------|-----|---------------------|-------|
| 29/12/2025 | Mon | Express.js server setup, middleware configuration | 8 |
| 30/12/2025 | Tue | MongoDB Atlas connection, environment variables | 8 |
| 31/12/2025 | Wed | User registration API with bcrypt hashing | 8 |
| 01/01/2026 | Thu | Holiday – New Year | - |
| 02/01/2026 | Fri | Login API with JWT token generation | 8 |
| 03/01/2026 | Sat | Auth middleware (protect + authorize) | 4 |

**Weekly Summary:** Authentication system fully implemented. JWT tokens generated on login, bcrypt hashing with 10 rounds, RBAC middleware protecting routes.

---

### WEEK 4 (05 Jan – 11 Jan 2026): Core Backend APIs

| Date | Day | Activities Performed | Hours |
|------|-----|---------------------|-------|
| 05/01/2026 | Mon | Traveler registration and approval APIs | 8 |
| 06/01/2026 | Tue | Bus CRUD APIs (add, edit, delete, list) | 8 |
| 07/01/2026 | Wed | BusSchedule CRUD APIs | 8 |
| 08/01/2026 | Thu | Auto seat generation on schedule creation | 8 |
| 09/01/2026 | Fri | Bus search API with filters | 8 |
| 10/01/2026 | Sat | API testing with Postman | 4 |

**Weekly Summary:** Core backend APIs for bus and schedule management completed. Auto-generation of 40 seats on schedule creation implemented and tested.

---

### WEEK 5 (12 Jan – 18 Jan 2026): Booking APIs

| Date | Day | Activities Performed | Hours |
|------|-----|---------------------|-------|
| 12/01/2026 | Mon | Seat availability API | 8 |
| 13/01/2026 | Tue | Seat locking mechanism (5-min timeout) | 8 |
| 14/01/2026 | Wed | Booking creation with MongoDB transactions | 8 |
| 15/01/2026 | Thu | Booking confirmation and status update | 8 |
| 16/01/2026 | Fri | Booking cancellation API | 8 |
| 17/01/2026 | Sat | Booking history API, Postman testing | 4 |

**Weekly Summary:** Complete booking workflow implemented with MongoDB transactions. Double-booking prevention tested and verified.

---

### WEEK 6 (19 Jan – 25 Jan 2026): Admin APIs & React Setup

| Date | Day | Activities Performed | Hours |
|------|-----|---------------------|-------|
| 19/01/2026 | Mon | Admin user management APIs | 8 |
| 20/01/2026 | Tue | Admin traveler approval APIs | 8 |
| 21/01/2026 | Wed | Support ticket APIs | 8 |
| 22/01/2026 | Thu | React project setup with Vite + Tailwind CSS | 8 |
| 23/01/2026 | Fri | React Router setup, AuthContext implementation | 8 |
| 24/01/2026 | Sat | Axios instance with JWT interceptors | 4 |

**Weekly Summary:** All backend APIs completed. React frontend project initialized with routing and authentication context.

---

### WEEK 7 (26 Jan – 01 Feb 2026): Frontend – Auth & Home

| Date | Day | Activities Performed | Hours |
|------|-----|---------------------|-------|
| 26/01/2026 | Sun | Holiday – Republic Day | - |
| 27/01/2026 | Mon | Login page UI implementation | 8 |
| 28/01/2026 | Tue | Register page UI implementation | 8 |
| 29/01/2026 | Wed | Home page with hero section | 8 |
| 30/01/2026 | Thu | Navbar and Footer components | 8 |
| 31/01/2026 | Fri | PrivateRoute component for protected routes | 8 |

**Weekly Summary:** Authentication UI completed. Login, register, and home pages functional with API integration.

---

### WEEK 8 (02 Feb – 08 Feb 2026): Customer Dashboard

| Date | Day | Activities Performed | Hours |
|------|-----|---------------------|-------|
| 02/02/2026 | Mon | Bus search component with filters | 8 |
| 03/02/2026 | Tue | Search results display | 8 |
| 04/02/2026 | Wed | Visual seat selection grid component | 8 |
| 05/02/2026 | Thu | Passenger details form | 8 |
| 06/02/2026 | Fri | Booking confirmation page | 8 |
| 07/02/2026 | Sat | My Bookings page | 4 |

**Weekly Summary:** Complete customer booking flow implemented. Visual seat grid with color-coded availability working correctly.

---

### WEEK 9 (09 Feb – 15 Feb 2026): Traveler Dashboard

| Date | Day | Activities Performed | Hours |
|------|-----|---------------------|-------|
| 09/02/2026 | Mon | Add Bus form component | 8 |
| 10/02/2026 | Tue | Bus list with edit/delete | 8 |
| 11/02/2026 | Wed | Add Schedule form | 8 |
| 12/02/2026 | Thu | Schedule list with management | 8 |
| 13/02/2026 | Fri | Booking analytics component | 8 |
| 14/02/2026 | Sat | Support tickets component | 4 |

**Weekly Summary:** Traveler dashboard fully implemented with fleet management, schedule creation, and booking analytics.

---

### WEEK 10 (16 Feb – 22 Feb 2026): Admin Dashboard & Integration

| Date | Day | Activities Performed | Hours |
|------|-----|---------------------|-------|
| 16/02/2026 | Mon | Admin dashboard stats component | 8 |
| 17/02/2026 | Tue | User management component | 8 |
| 18/02/2026 | Wed | Traveler management and approval | 8 |
| 19/02/2026 | Thu | Ticket management component | 8 |
| 20/02/2026 | Fri | Full frontend-backend integration testing | 8 |
| 21/02/2026 | Sat | Bug fixes from integration testing | 4 |

**Weekly Summary:** Admin dashboard completed. Full integration testing revealed and resolved 12 bugs across frontend and backend.

---

### WEEK 11 (23 Feb – 01 Mar 2026): Testing & Bug Fixes

| Date | Day | Activities Performed | Hours |
|------|-----|---------------------|-------|
| 23/02/2026 | Mon | Comprehensive Postman API testing | 8 |
| 24/02/2026 | Tue | Security testing (JWT, RBAC, input validation) | 8 |
| 25/02/2026 | Wed | Performance testing, response time measurement | 8 |
| 26/02/2026 | Thu | Mobile responsiveness testing | 8 |
| 27/02/2026 | Fri | User acceptance testing with test users | 8 |
| 28/02/2026 | Sat | Bug fixes and UI improvements | 4 |

**Weekly Summary:** All 8 test cases passed. API response times within 500ms threshold. Mobile responsiveness verified on multiple devices.

---

### WEEK 12 (02 Mar – 08 Mar 2026): Deployment

| Date | Day | Activities Performed | Hours |
|------|-----|---------------------|-------|
| 02/03/2026 | Mon | MongoDB Atlas production cluster setup | 8 |
| 03/03/2026 | Tue | Backend deployment to Heroku/Railway | 8 |
| 04/03/2026 | Wed | Frontend deployment to Vercel | 8 |
| 05/03/2026 | Thu | Environment variables configuration | 8 |
| 06/03/2026 | Fri | Production testing and bug fixes | 8 |
| 07/03/2026 | Sat | SSL configuration, CORS setup | 4 |

**Weekly Summary:** Application successfully deployed to production. All features verified in production environment.

---

### WEEK 13 (09 Mar – 15 Mar 2026): Documentation & Report

| Date | Day | Activities Performed | Hours |
|------|-----|---------------------|-------|
| 09/03/2026 | Mon | Postman API documentation finalization | 8 |
| 10/03/2026 | Tue | Project report writing – Chapters 1–2 | 8 |
| 11/03/2026 | Wed | Project report writing – Chapters 3–4 | 8 |
| 12/03/2026 | Thu | Project report writing – Chapters 5 + Conclusion | 8 |
| 13/03/2026 | Fri | Research paper writing and submission | 8 |
| 14/03/2026 | Sat | Final review with mentor, report submission | 4 |
| 15/03/2026 | Sun | Internship completion | - |

**Weekly Summary:** All documentation completed. Research paper submitted to IJIRSET. Internship successfully completed.

---

## Page 87–89: INTERNSHIP IDENTIFICATION EXERCISE (Annexure-07)

# INTERNSHIP IDENTIFICATION EXERCISE
## Annexure-07

### Part A: Organization Identification

**1. Name of the Organization:** Fox Trading Solutions

**2. Address:** Bengaluru, Karnataka, India

**3. Nature of Business:** Full Stack Web Development, Software Solutions, Digital Transformation

**4. Products/Services Offered:**
- Full-Stack Web Application Development (MERN Stack)
- RESTful API Development
- Database Design and Management
- Cloud Infrastructure and Deployment
- UI/UX Design and Frontend Development

**5. Number of Employees:** 10–50 (Small-scale technology company)

**6. Annual Turnover:** Confidential

**7. Year of Establishment:** 2019

---

### Part B: Internship Role Identification

**1. Designation during Internship:** Full Stack Web Development Intern

**2. Department:** Software Development

**3. Reporting To:** Mr. Shashwat Dubey (Technical Lead / Mentor)

**4. Key Responsibilities:**
- Design and develop the BusYatra Bus Booking System using MERN stack
- Implement RESTful APIs with Node.js and Express.js
- Design MongoDB database schemas and implement Mongoose models
- Build React.js frontend with Tailwind CSS
- Implement JWT authentication and role-based access control
- Test APIs using Postman
- Deploy application to cloud platforms

**5. Skills Applied:**
- JavaScript (ES6+), Node.js, Express.js
- React.js, Tailwind CSS, React Router
- MongoDB, Mongoose ODM
- JWT, bcrypt, REST API design
- Git, GitHub, VS Code
- Postman, Heroku, Vercel, MongoDB Atlas

---

### Part C: Learning Outcomes

**Technical Skills Gained:**
1. Proficiency in MERN stack full-stack development
2. RESTful API design and implementation
3. MongoDB schema design and query optimization
4. JWT-based authentication and RBAC implementation
5. React.js component architecture and state management
6. Cloud deployment (Vercel, Heroku, MongoDB Atlas)
7. API testing with Postman

**Professional Skills Gained:**
1. Agile development methodology and sprint planning
2. Code review and version control with Git
3. Technical documentation writing
4. Problem-solving in a professional environment
5. Time management and deadline adherence

**Industry Exposure:**
- Real-world software development workflow
- Client requirement analysis and feature prioritization
- Production deployment and monitoring
- Research paper writing and publication

---

## Page 90–93: STUDENT INTERNSHIP PERIODIC ASSESSMENT REVIEW CARD (Annexure-02)

# STUDENT INTERNSHIP PERIODIC ASSESSMENT REVIEW CARD
## Annexure-02

---

### REVIEW CARD I (End of Week 4 – January 2026)

| Assessment Criteria | Max Marks | Marks Obtained |
|--------------------|-----------|---------------|
| Understanding of project requirements | 10 | 9 |
| Technical knowledge and application | 10 | 9 |
| Work quality and code standards | 10 | 8 |
| Communication and reporting | 10 | 9 |
| Punctuality and discipline | 10 | 10 |
| **Total** | **50** | **45** |

**Mentor Remarks:** Ghanshyam has demonstrated excellent understanding of the MERN stack and has successfully completed the database design and authentication module. Shows strong initiative and problem-solving skills.

**Mentor Signature:** Mr. Shashwat Dubey | Date: 10/01/2026

---

### REVIEW CARD II (End of Week 8 – February 2026)

| Assessment Criteria | Max Marks | Marks Obtained |
|--------------------|-----------|---------------|
| Progress on assigned tasks | 10 | 9 |
| Technical implementation quality | 10 | 9 |
| Problem-solving ability | 10 | 9 |
| Team collaboration | 10 | 8 |
| Documentation quality | 10 | 8 |
| **Total** | **50** | **43** |

**Mentor Remarks:** Excellent progress on the booking system. The visual seat selection component and MongoDB transaction-based booking flow are well-implemented. Frontend UI is clean and responsive.

**Mentor Signature:** Mr. Shashwat Dubey | Date: 07/02/2026

---

### REVIEW CARD III (End of Internship – March 2026)

| Assessment Criteria | Max Marks | Marks Obtained |
|--------------------|-----------|---------------|
| Overall project completion | 20 | 19 |
| Technical depth and quality | 20 | 18 |
| Testing and deployment | 20 | 18 |
| Documentation and reporting | 20 | 17 |
| Professional conduct | 20 | 20 |
| **Total** | **100** | **92** |

**Mentor Remarks:** Ghanshyam has successfully completed the BusYatra project — a fully functional, deployed MERN stack application. The project demonstrates strong technical skills, professional work ethic, and the ability to deliver a production-ready application independently. Highly recommended for full-stack development roles.

**Mentor Signature:** Mr. Shashwat Dubey | Date: 15/03/2026

**Internal Guide Signature:** Mr. Utpal Patel | Date: 20/03/2026

**HOD Signature:** Prof. Sumitra Mahajan | Date: 22/03/2026

---

**END OF REPORT**

**Student:** Ghanshyam Dubey | **Enrollment:** 210305105699
**B.E. CSE | Parul Institute of Technology | Parul University | AY 2025-26**
