import React, { useState } from "react";

const ProfileSettings = ({ userRole }) => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        password: '',
        role: userRole || 'User',
        imageUrl: '' // Store uploaded image URL
    });

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin': return 'Admin';
            case 'merchant': return 'Merchant';
            case 'clerk': return 'Clerk';
            default: return 'User';
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "maliik_preset");

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dkyn1rdxb/image/upload", {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            console.log("Cloudinary Response:", data);
            setProfile((prevProfile) => ({ ...prevProfile, imageUrl: data.secure_url }));
            alert("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Profile updated:', profile);
        alert('Profile updated successfully!');
        setProfile({ name: '', email: '', password: '', role: userRole || 'User', imageUrl: '' });
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: '400px', margin: 'auto' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {['name', 'email', 'password'].map((field) => (
                    <label key={field} style={{ color: '#444', fontWeight: 'bold', display: 'flex', flexDirection: 'column' }}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                        <input
                            type={field === 'password' ? 'password' : 'text'}
                            name={field}
                            value={profile[field]}
                            onChange={handleInputChange}
                            placeholder={`Enter your ${field}`}
                            required
                            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '5px' }}
                        />
                    </label>
                ))}

                {/* Image Upload */}
                <label style={{ color: '#444', fontWeight: 'bold', display: 'flex', flexDirection: 'column' }}>
                    Profile Image:
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginTop: '5px' }} />
                </label>

                {/* Display Image Preview */}
                {profile.imageUrl && (
                    <img src={profile.imageUrl} alt="Profile Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', marginTop: '10px' }} />
                )}

                <label style={{ color: '#444', fontWeight: 'bold', display: 'flex', flexDirection: 'column' }}>
                    Role:
                    <input
                        type="text"
                        name="role"
                        value={getRoleLabel(profile.role)}
                        disabled
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '5px', backgroundColor: '#e9ecef' }}
                    />
                </label>

                <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: 'background 0.3s ease' }}>
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default ProfileSettings;
