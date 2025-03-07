// src/pages/MerchantPage.jsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

// Mock data for admins
const mockAdmins = [
    { id: 1, name: 'Admin 1', status: 'Active' },
    { id: 2, name: 'Admin 2', status: 'Deactivated' },
];

// Mock functions to simulate API calls
const fetchAdmins = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockAdmins);
        }, 1000); // Simulate a 1 second delay
    });
};

const addAdmin = async (email) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Added admin with email:', email);
            resolve('Admin added');
        }, 500); // Simulate a 0.5 second delay
    });
};

const fetchStorePerformance = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                store1: { totalSales: 1000, totalProducts: 50, paidProducts: 30, unpaidProducts: 20 },
                store2: { totalSales: 1500, totalProducts: 70, paidProducts: 50, unpaidProducts: 20 },
            });
        }, 500); // Simulate a 0.5 second delay
    });
};

// Mock function to fetch individual product performance
const fetchProductPerformance = async (store) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                productA: { sales: 500, paid: 30, unpaid: 10 },
                productB: { sales: 500, paid: 20, unpaid: 10 },
            });
        }, 500); // Simulate a 0.5 second delay
    });
};

const MerchantPage = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [performanceData, setPerformanceData] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [productPerformanceData, setProductPerformanceData] = useState(null);

    useEffect(() => {
        const getAdmins = async () => {
            try {
                const data = await fetchAdmins(); // Fetch admins from the mock data
                setAdmins(data);
            } catch (error) {
                setError('Error fetching admins');
                console.error('Error fetching admins:', error);
            } finally {
                setLoading(false);
            }
        };

        getAdmins();
    }, []);

    const handleAddAdmin = async () => {
        try {
            await addAdmin(newAdminEmail); // Function to add a new admin
            alert('Admin added successfully!');
            setNewAdminEmail(''); // Clear input
        } catch (error) {
            console.error('Error adding admin:', error);
        }
    };

    const handleViewPerformance = async () => {
        const data = await fetchStorePerformance(); // Function to fetch store performance
        setPerformanceData(data);
        console.log('Store Performance Data:', data);
    };

    const handleStoreSelect = async (store) => {
        setSelectedStore(store);
        const data = await fetchProductPerformance(store); // Fetch product performance for the selected store
        setProductPerformanceData(data);
    };

    const handleDeactivateAdmin = (adminId) => {
        setAdmins(admins.map(admin =>
            admin.id === adminId ? { ...admin, status: 'Deactivated' } : admin
        ));
        alert('Admin deactivated successfully!');
    };

    const handleDeleteAdmin = (adminId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this admin?');
        if (confirmDelete) {
            setAdmins(admins.filter(admin => admin.id !== adminId));
            alert('Admin deleted successfully!');
        }
    };

    if (loading) return <p>Loading admins...</p>;
    if (error) return <p>{error}</p>;

    // Prepare data for the store performance chart
    const chartData = {
        labels: Object.keys(performanceData || {}).map(store => `Store ${store}`),
        datasets: [
            {
                label: 'Total Sales',
                data: performanceData ? Object.values(performanceData).map(store => store.totalSales) : [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Paid Products',
                data: performanceData ? Object.values(performanceData).map(store => store.paidProducts) : [],
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
            {
                label: 'Unpaid Products',
                data: performanceData ? Object.values(performanceData).map(store => store.unpaidProducts) : [],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };

    // Prepare data for the product performance chart
    const productChartData = {
        labels: Object.keys(productPerformanceData || {}),
        datasets: [
            {
                label: 'Sales',
                data: productPerformanceData ? Object.values(productPerformanceData).map(product => product.sales) : [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Paid',
                data: productPerformanceData ? Object.values(productPerformanceData).map(product => product.paid) : [],
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
            {
                label: 'Unpaid',
                data: productPerformanceData ? Object.values(productPerformanceData).map(product => product.unpaid) : [],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };

    return (
        <div>
            <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="New Admin Email"
                required
                style={{ marginRight: '10px', padding: '5px' }}
            />
            <button style={{ marginBottom: '10px', padding: '5px 10px' }} onClick={handleAddAdmin}>
                Add Admin
            </button>

            <h2>Manage Admins</h2>
            <ul>
                {admins.map(admin => (
                    <li key={admin.id} style={{ marginBottom: '10px' }}>
                        {admin.name} - Status: {admin.status}
                        <button
                            style={{ marginLeft: '10px', marginRight: '5px', padding: '5px 10px' }}
                            onClick={() => handleDeactivateAdmin(admin.id)}
                        >
                            Deactivate
                        </button>
                        <button
                            style={{ padding: '5px 10px' }}
                            onClick={() => handleDeleteAdmin(admin.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <button style={{ marginTop: '10px', padding: '10px 15px' }} onClick={handleViewPerformance}>
                View Store Performance
            </button>

            {performanceData && (
                <div>
                    <h2>Store Performance</h2>
                    <Bar data={chartData} />

                    <h3>Select a Store to View Product Performance</h3>
                    <div style={{ marginTop: '10px' }}>
                        {Object.keys(performanceData).map(store => (
                            <button
                                key={store}
                                style={{ marginRight: '10px', padding: '5px 10px' }}
                                onClick={() => handleStoreSelect(store)}
                            >
                                View {store}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {selectedStore && productPerformanceData && (
                <div>
                    <h2>Product Performance for {selectedStore}</h2>
                    <Bar data={productChartData} />
                </div>
            )}
        </div>
    );
};

export default MerchantPage;