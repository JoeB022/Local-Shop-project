import React from 'react';

const AboutPage = () => {
    return (
        <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
            <div className="bg-white shadow-md rounded-lg p-4 max-w-xl mx-auto text-center">
                <h1 className="text-xl font-bold mb-3">About Local Shop Project</h1>
                <p className="mb-3 text-sm">
                    The Local Shop project is designed to provide a comprehensive solution for managing local retail businesses.
                    Our platform aims to streamline operations, enhance customer experience, and improve overall efficiency.
                    With a user-friendly interface, it allows shop owners, clerks, and administrators to manage their tasks seamlessly.
                </p>
                <p className="mb-3 text-sm">
                    This project incorporates various features tailored to meet the needs of local shops, including inventory management,
                    order processing, and user authentication. By leveraging modern web technologies, we ensure that the platform is
                    both responsive and accessible, allowing users to manage their shops from any device, anywhere.
                </p>
                <p className="text-sm">
                    Our mission is to empower local businesses by providing them with the tools they need to thrive in a competitive market.
                    We believe that by simplifying the management process, shop owners can focus more on what they do best: serving their customers.
                    We are committed to continuous improvement and welcome feedback from our users to enhance the platform further.
                </p>
            </div>
        </div>
    );
};

export default AboutPage;
