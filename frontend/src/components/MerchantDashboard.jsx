// src/components/Dashboard/MerchantDashboard.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MerchantPage from '../pages/MerchantPage';

const MerchantDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className=' w-full mx-auto max-w-6xl bg-white !p-6'>
            <p className='text-2xl font-semibold tracking-tight'>Merchant Dashboard</p>
            <MerchantPage />
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default MerchantDashboard;