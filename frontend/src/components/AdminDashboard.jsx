// src/pages/AdminPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all necessary components from Chart.js
Chart.register(...registerables);

// Mock data for clerks and products
const mockClerks = [
    { id: 1, name: 'Clerk 1', status: 'Active', requestId: 101 },
    { id: 2, name: 'Clerk 2', status: 'Pending', requestId: 102 },
    { id: 3, name: 'Clerk 3', status: 'Active', requestId: 103 },
];

const mockProducts = [
    { id: 1, name: 'Product A', paid: true },
    { id: 2, name: 'Product B', paid: false },
    { id: 3, name: 'Product C', paid: true },
];

// Mock functions to simulate API calls
const fetchClerks = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockClerks);
        }, 1000);
    });
};

const approveSupplyRequest = async (requestId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Request ${requestId} approved`);
        }, 500);
    });
};

const deactivateClerk = async (clerkId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Clerk ${clerkId} deactivated`);
        }, 500);
    });
};

const AdminPage = () => {
    const [clerks, setClerks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState(mockProducts);
    const chartRef = useRef(null); // Create a ref for the chart

    useEffect(() => {
        const getClerks = async () => {
            try {
                const data = await fetchClerks();
                setClerks(data);
            } catch (error) {
                setError('Error fetching clerks');
                console.error('Error fetching clerks:', error);
            } finally {
                setLoading(false);
            }
        };

        getClerks();
    }, []);

    const handleApproveRequest = async (requestId) => {
        try {
            await approveSupplyRequest(requestId);
            alert('Supply request approved successfully!');
        } catch (error) {
            console.error('Error approving supply request:', error);
        }
    };

    const handleDeactivateClerk = async (clerkId) => {
        try {
            await deactivateClerk(clerkId);
            alert('Clerk deactivated successfully!');
            setClerks(clerks.filter(clerk => clerk.id !== clerkId));
        } catch (error) {
            console.error('Error deactivating clerk:', error);
        }
    };

    const handleChangePaymentStatus = (productId) => {
        setProducts(products.map(product =>
            product.id === productId ? { ...product, paid: true } : product
        ));
        alert('Payment status updated to paid!');
    };

    if (loading) return <p>Loading clerks...</p>;
    if (error) return <p>{error}</p>;

    // Chart data
    const chartData = {
        labels: ['Paid', 'Not Paid'],
        datasets: [
            {
                label: 'Payment Status',
                data: [
                    products.filter(product => product.paid).length,
                    products.filter(product => !product.paid).length,
                ],
                backgroundColor: ['#007bff', '#dc3545'],
            },
        ],
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ color: '#333', textAlign: 'center' }}>Admin Dashboard</h1>
            <h2 style={{ color: '#007bff' }}>Manage Clerks</h2>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {clerks.map(clerk => (
                    <li key={clerk.id} style={{ background: 'white', margin: '10px 0', padding: '10px', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                        <span>{clerk.name} - {clerk.status}</span>
                        <button onClick={() => handleApproveRequest(clerk.requestId)} style={{ marginLeft: '10px' }}>Approve Request</button>
                        <button onClick={() => handleDeactivateClerk(clerk.id)} style={{ marginLeft: '10px' }}>Deactivate</button>
                    </li>
                ))}
            </ul>
            <h2 style={{ color: '#007bff' }}>Product Payment Status</h2>
            <div className="chart-container" style={{ width: '100%', height: '400px' }}>
                <Bar
                    ref={chartRef}
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false
                    }}
                />
            </div>
            <h3 style={{ color: '#333' }}>Products</h3>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {products.map(product => (
                    <li key={product.id} style={{ background: 'white', margin: '10px 0', padding: '10px', borderRadius: '5px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                        <span>{product.name} - {product.paid ? 'Paid' : 'Not Paid'}</span>
                        {!product.paid && (
                            <button onClick={() => handleChangePaymentStatus(product.id)} style={{ marginLeft: '10px' }}>Mark as Paid</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPage;