# 🍕 Al Forno Pizzeria (Neapolitan Pizza Order Management System)

A modern, full-stack restaurant order management system designed for a Neapolitan Pizza shop. The application features a sleek customer-facing ordering app and a Zomato-partner-style live admin dashboard for the kitchen staff.

## 🌟 Key Features

### 🧑‍🍳 Customer Experience
- **Interactive Menu:** Browse pizzas, customize with premium toppings, and add to cart.
- **Hybrid Checkout:** Pay at Counter or Pay Online functionality.
- **Live Order Tracking:** Real-time progress tracker (Received → Preparing → Baking in Oven → Ready for Pickup) powered by WebSockets.
- **Responsive UI:** Mobile-first, vibrant aesthetics with smooth micro-animations.

### 👔 Admin Dashboard (Partner Central)
- **Real-Time KDS:** Kitchen Display System that auto-updates without refreshing when new orders arrive.
- **Order Lifecycle Management:** One-click status updates to move food through the kitchen pipeline.
- **Completed Orders Log:** Track all finalized orders and cash collections.
- **Secure Access:** Lightweight PIN-based authorization wall to prevent unauthorized access.
- **Business Insights:** High-level analytics of total revenue and order volume.

---

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)**
- **Tailwind CSS** (for styling and modern UI components)
- **Lucide React** (Icons)
- **Axios** (API requests)
- **SockJS & STOMP** (for real-time WebSocket communication)

### Backend
- **Java 17 & Spring Boot 3**
- **Spring Data JPA & Hibernate**
- **PostgreSQL** (Production/Supabase) / **H2** (Local Dev)
- **Spring WebSockets** (for real-time order tracking and KDS)

---

## 🚀 Running the Project Locally

### 1. Prerequisites
- **Node.js** (v18+)
- **Java 17** (or higher)
- **Maven** (or use the provided `mvnw` wrapper)

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file in the root of the `backend` folder and add your environment variables:
   ```bash
   export DB_PASSWORD="your_supabase_db_password"
   export ADMIN_PIN="your_secret_admin_pin"
   ```
3. Run the backend server using the `postgres` profile:
   ```bash
   source .env && mvn spring-boot:run -Dspring-boot.run.profiles=postgres
   ```
   *(Note: The backend runs on `http://localhost:8080`)*

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(Note: The frontend runs on `http://localhost:5173`)*

---

## 🧭 Application Navigation

Once both servers are running:
- **Customer Facing App:** [http://localhost:5173/](http://localhost:5173/)
- **Admin Dashboard:** [http://localhost:5173/admin](http://localhost:5173/admin) *(Requires your ADMIN_PIN to enter)*

---

## 🔐 Security

The application utilizes a lightweight `HandlerInterceptor` on the Spring Boot backend that intercepts all `/api/admin/**` endpoints, requiring a matching `X-Admin-Key` header. This provides a fast, stateless security wall for small restaurant environments without the overhead of full enterprise user session management.
