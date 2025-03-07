
#LocalShop - Inventory Management System

Effortless inventory tracking, financial management, and data visualization—all in one app.

---

Overview

LocalShop is a full-stack inventory management system designed for small businesses to track stock, manage supply requests, and generate financial reports with data visualization.

Why LocalShop?

 Automated Stock Tracking – No more manual entries.
 Role-Based Access – Merchants, Admins, and Clerks.
 Data Visualization – Charts for insights.
 Mobile-Friendly UI – Works on any device.
 Secure Authentication – Supports Google .


---

Features

 User Management

Superuser invites admins via email.

Admins manage clerks and oversee inventory.


 Inventory Tracking

Clerks update stock, mark payments, and track spoiled items.

Restock requests sent directly to admins.


 Reporting & Analytics

Sales & stock reports generated in real-time.

Graphs and charts for visualization.


 Authentication & Authorization

JWT-based authentication.

Social login (Google, GitHub).



---

Tech Stack

Frontend

React (Vite)

Tailwind CSS

Redux Toolkit / useContext (state management)


Backend

Flask

PostgreSQL

Flask-JWT for authentication

Flask-Mail for email invites



Visualization

JavaScript plotting library (Charts.js / D3.js)



---

Installation

 Prerequisites

Make sure you have:

Node.js & npm

Python & Pipenv

PostgreSQL


 Clone Repository

git clone https://github.com/yourusername/localshop.git  
cd localshop

 Backend Setup

cd backend  
pipenv install



Run the backend:

pipenv run flask run

 Frontend Setup

cd ../frontend  
npm install  
npm run dev


---

Usage

 Merchant invites admins via email.
 Admins manage store clerks and inventory.
 Clerks update stock and handle transactions.
 Admins monitor sales reports and approve restocks.





---

Deployment

Backend: Deployed on Render

Frontend: Deployed on Vercel

---

---

License

This project is licensed under the MIT License.

 LocalShop - Your Ultimate Inventory Management Solution! 


