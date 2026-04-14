# BusYatra - Bus Booking & Reservation System
## Final Year Project Report — Front Matter (Pages i–ix)

---

## Page i: Cover Page

```
BusYatra: Bus Booking & Reservation System

A PROJECT REPORT

Submitted by

GHANSHYAM DUBEY
Enrollment No: 210305105699

In fulfillment for the award of the degree of

BACHELOR OF ENGINEERING
In
Computer Science and Engineering

Parul Institute of Technology, Limbda
Parul University, Vadodara

[Parul University Logo]  [NAAC A++ Logo]

Session: AY 2025-2026
```

---

## Page ii: Certificate of Internship

```
Parul Institute of Technology, Limbda

[Parul University Logo]  [NAAC A++ Logo]

CERTIFICATE OF INTERNSHIP

This is to certify that the project report submitted along with the project entitled
BusYatra: Bus Booking & Reservation System has been carried out by GHANSHYAM
DUBEY (Enrollment No: 210305105699) under my guidance in fulfillment for the degree
of Bachelor of Engineering in Computer Science and Engineering, 8th Semester of
Parul University, Vadodara during the AY 2025-26.


MR. UTPAL PATEL                           PROF. SUMITRA MAHAJAN
Internal Guide                            Head of the Department
Dept. of Computer Science & Engineering   Dept. of Computer Science & Engineering
Parul Institute of Technology             Parul Institute of Technology
Parul University                          Parul University
```

---

## Page iii: Internship Completion Letter / Certificate

```
Date: 15/03/2026

TO WHOM IT MAY CONCERN

This is to certify that Ghanshyam Dubey, a student of Parul Institute of Technology,
has successfully completed his internship in the field of Full Stack Web Development
from 15-Dec-2025 to 15-Mar-2026 (Total Duration: 13 Weeks) under the guidance of
Mr. Shashwat Dubey.

His internship activities included:
  • Requirements Analysis and System Design
  • Database Schema Design (MongoDB)
  • Backend API Development (Node.js / Express.js)
  • Frontend Development (React.js / Tailwind CSS)
  • Testing & Validation (Postman, Manual Testing)
  • Cloud Deployment (Vercel, Heroku, MongoDB Atlas)

During the period of his internship, he was found diligent, hardworking, and inquisitive.
We wish him every success in his life and career.

For Fox Trading Solutions
Authorised Signature with Industry Stamp
```

---

## Page iv: Acknowledgement

I would like to express my sincere gratitude to everyone who contributed to the successful
completion of my project, **BusYatra: Bus Booking & Reservation System**.

Firstly, I extend my deepest appreciation to my internal guide **Mr. Utpal Patel** and the
Head of Department **Prof. Sumitra Mahajan**, whose guidance, encouragement, and
expertise have been invaluable throughout this project. Their insightful feedback helped me
refine my approach and improve the overall quality of my work.

I am grateful to **Fox Trading Solutions** and my industry mentor **Mr. Shashwat Dubey**
for providing me with a real-world project environment, hands-on exposure to the MERN
stack, and continuous support during the internship period (15 Dec 2025 – 15 Mar 2026).

I would also like to thank my institution, **Parul Institute of Technology, Parul University**,
for providing the necessary resources, knowledge, and a conducive learning environment
that enabled me to explore and implement advanced full-stack web development techniques.

A special thanks to my friends and colleagues for their continuous motivation, constructive
discussions, and shared learning experiences, which greatly enriched my understanding of
RESTful API design, JWT authentication, and modern web application development.

Lastly, I am deeply grateful to my family for their unwavering support, patience, and
encouragement throughout this journey.

**Ghanshyam Dubey**
Enrollment No: 210305105699
B.E. – Computer Science and Engineering
Parul Institute of Technology, Parul University

---

## Page v: Paper Publication Certificate

```
CERTIFICATE OF PUBLICATION

International Journal of Innovative Research in
Science, Engineering and Technology (IJIRSET)

(A Monthly, Peer Reviewed, Refereed, Multidisciplinary, Scholarly Indexed,
Open Access Journal since 2012)

Impact Factor: 8.699

The Board of IJIRSET is hereby Awarding this Certificate to

GHANSHYAM DUBEY

Department of Computer Science and Engineering,
Parul University, Vadodara, Gujarat, India

in Recognition of Publication of the Paper Entitled

"BusYatra: Bus Booking & Reservation System Using MERN Stack"

in IJIRSET, Volume 15, Issue 3, March 2026

e-ISSN: 2319-8753   |   p-ISSN: 2347-6710
www.ijirset.com
```

---

## Page vi: Abstract

**ABSTRACT**

This report presents **BusYatra: Bus Booking & Reservation System**, a comprehensive
web-based platform designed to digitize and streamline the bus ticket booking process.
By providing real-time seat availability, automated schedule management, and role-based
access control, the system addresses critical challenges in traditional bus booking systems
including manual errors, lack of transparency, and inefficient fleet management.

The project employs the MERN stack (MongoDB, Express.js, React.js, Node.js) along with
modern technologies including Tailwind CSS, JWT authentication, bcrypt encryption, and
Mongoose ODM. The system implements a three-tier architecture with separate dashboards
for Customers, Travelers (Bus Operators), and Administrators, each with role-specific
functionalities and access controls.

Key features include intelligent bus search with filters, interactive seat selection with a
visual grid layout, multi-seat booking (up to 6 seats), automated seat generation (40 seats
per schedule), real-time availability tracking, and a centralized support ticket management
system. The database design includes 9 MongoDB collections with optimized indexes
supporting complex queries for bus search, seat availability, and booking management.

The results demonstrate that BusYatra is a reliable, scalable, and user-friendly platform
for bus ticket booking, supporting early adoption by bus operators and providing customers
with a seamless booking experience.

**Keywords:** Bus Booking System, MERN Stack, RESTful API, JWT Authentication,
Role-Based Access Control, Real-time Seat Availability, MongoDB, React.js, Node.js,
Transportation Technology, Web Application Development

---

## Page vii: Table of Contents

```
TABLE OF CONTENTS

Cover Page (as per attachment) ........................................................ i
Certificate of Internship (as per attachment) ..................................... ii
Internship Completion Letter / Certificate .......................................... iii
Acknowledgement ............................................................................... iv
Paper Publication Certificate .............................................................. v
Abstract ................................................................................................ vi
Table of Contents .................................................................................. vii
List of Abbreviations ............................................................................. viii
List of Figures ........................................................................................ ix

Chapter 1: Introduction ......................................................................... 01–03
  1.1  Background and Motivation
  1.2  Problem Statement
  1.3  Overview of BusYatra System

Chapter 2: Aim and Objectives of the Internship ................................ 04–07
  2.1  Aim of the Internship
  2.2  Objectives
  2.3  Scope of Work
  2.4  Expected Outcomes

Chapter 3: Review of Literature / Industry Related Info ..................... 08–24
  3.1  Overview of Fox Trading Solutions
  3.2  Industry Overview – Online Bus Booking
  3.3  Review of Existing Systems
  3.4  Technology Stack Review
  3.5  Research Papers Review
  3.6  Gap Analysis

Chapter 4: Methodology: Materials and Methods ................................ 25–39
  4.1  Development Methodology
  4.2  System Architecture
  4.3  Database Design
  4.4  API Design
  4.5  Frontend Design
  4.6  Security Implementation
  4.7  Deployment Strategy

Chapter 5: Observations, Results and Discussion ................................ 40–44
  5.1  System Implementation Outcomes
  5.2  Feature-wise Results
  5.3  Performance Analysis
  5.4  Comparative Analysis
  5.5  Discussion

Conclusions & Summary ...................................................................... 45–46

Any Annexures of Report ..................................................................... 47

References ............................................................................................. 48–49

NOC from Department (Annexure-05) ................................................ 50

Internship Acceptance Letter from Industry ....................................... 51

Daily Log and Weekly Log (Annexure-06) – Log Book ...................... 52–86

Internship Identification Exercise (Annexure-07) ............................... 87–89

Student Internship Periodic Assessment Review Card I, II, III
(Annexure-02) ....................................................................................... 90–93
```

---

## Page viii: List of Abbreviations

```
LIST OF ABBREVIATIONS

API     Application Programming Interface
CORS    Cross-Origin Resource Sharing
CRUD    Create, Read, Update, Delete
CSS     Cascading Style Sheets
DFD     Data Flow Diagram
ER      Entity Relationship
HTTPS   Hypertext Transfer Protocol Secure
IDE     Integrated Development Environment
JSON    JavaScript Object Notation
JWT     JSON Web Token
MERN    MongoDB, Express.js, React.js, Node.js
MVC     Model-View-Controller
NoSQL   Not Only SQL
ODM     Object Document Mapper
OTP     One-Time Password
RBAC    Role-Based Access Control
REST    Representational State Transfer
SDLC    Software Development Life Cycle
SPA     Single Page Application
SQL     Structured Query Language
TLS     Transport Layer Security
UI      User Interface
UML     Unified Modeling Language
UX      User Experience
VS Code Visual Studio Code
```

---

## Page ix: List of Figures

```
LIST OF FIGURES

Fig 1.0   Fox Trading Solutions – Organization Chart .......................... 10
Fig 2.0   BusYatra – System Architecture Diagram .............................. 28
Fig 3.0   Entity-Relationship (ER) Diagram .......................................... 31
Fig 4.0   Data Flow Diagram – Level 0 (Context Diagram) .................. 33
Fig 5.0   Data Flow Diagram – Level 1 ................................................. 34
Fig 6.0   Use Case Diagram ................................................................... 35
Fig 7.0   Activity Diagram – Booking Flow ........................................... 36
Fig 8.0   Sequence Diagram – Booking Workflow ................................. 37
Fig 9.0   Project Gantt Chart .................................................................. 27
Fig 10.0  Customer Dashboard – Screenshot .......................................... 41
Fig 11.0  Traveler Dashboard – Screenshot ............................................ 41
Fig 12.0  Admin Dashboard – Screenshot .............................................. 42
Fig 13.0  Bus Search Results – Screenshot ............................................. 42
Fig 14.0  Seat Selection Interface – Screenshot ...................................... 43
Fig 15.0  Booking Confirmation Page – Screenshot ............................... 43
Fig 16.0  API Response Time Graph ...................................................... 44
Fig 17.0  Booking Flow – Postman API Test .......................................... 44
```

---

**End of Front Matter (Pages i–ix)**
