import React from 'react';
import ProfileSettings from '../pages/ProfileSettings'; // Ensure the path is correct

const ProfileDashboard = ({ userRole }) => {
    // Determine the user role label
    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin':
                return 'Admin';
            case 'merchant':
                return 'Merchant';
            case 'clerk':
                return 'Clerk';
            default:
                return 'User';
        }
    };

    return (
        <div style={{ padding: 20 }}>

            {/* <h2>Welcome, {getRoleLabel(userRole)}!</h2> */}
            <ProfileSettings userRole={userRole} />
        </div>
    );
};

export default ProfileDashboard;
