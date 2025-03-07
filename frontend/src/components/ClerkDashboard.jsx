import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClerkPage from '../pages/ClerkPage';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const ClerkDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Container fluid className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
            <Card className="shadow p-4 w-75">
                <Card.Header className="bg-primary text-white text-center">
                    <h2>Clerk Dashboard</h2>
                </Card.Header>
                <Card.Body>
                    <Row className="justify-content-center">
                        <Col md={10}>
                            <ClerkPage />
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Footer className="text-center">
                    <Button variant="danger" onClick={handleLogout}>
                        Logout
                    </Button>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default ClerkDashboard;