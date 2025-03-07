// src/pages/HomePage.jsx
import React from 'react';
import '../App.css'; // Import the global CSS file

const HomePage = () => {
    return (
        <div className="container text-center">
            <div className="content">
                <h1>Welcome to LocalShop Inventory App</h1>
                <p>Your one-stop solution for managing inventory efficiently.</p>
                <p>
                    At LocalShop, we provide a seamless experience for merchants, admins, and clerks to manage their inventory, track orders, and ensure smooth operations.
                </p>
                <p>Our platform allows you to:</p>
                <ul>
                    <li>Track inventory levels in real-time.</li>
                    <li>Manage orders and suppliers effortlessly.</li>
                    <li>Generate detailed reports to analyze performance.</li>
                    <li>Request supplies and manage procurement processes.</li>
                </ul>
                <p>
                    Join us today and take control of your inventory management! Sign up now to get started and experience the benefits of efficient inventory management.
                </p>
              
            </div>
        </div>
    );
};

export default HomePage;
