import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ClerkPage from "../pages/ClerkPage";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

const ClerkDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container
      fluid
      className="vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)",
      }}
    >
      <Card
        className="shadow-lg p-4 w-75"
        style={{
          borderRadius: "12px",
          background: "white",
        }}
      >
        {/* Header */}
        <Card.Header
          className="text-white text-center"
          style={{
            background: "linear-gradient(90deg, #007bff, #0056b3)",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        >
          <h2 className="mb-0">Clerk Dashboard</h2>
        </Card.Header>

        {/* Main Content */}
        <Card.Body>
          <Row className="justify-content-center">
            <Col md={10}>
              <ClerkPage />
            </Col>
          </Row>
        </Card.Body>

        {/* Footer with Logout Button */}
        <Card.Footer className="text-center bg-white border-0">
          <Button
            variant="danger"
            onClick={handleLogout}
            className="px-4 py-2 fw-bold shadow-sm"
            style={{
              borderRadius: "8px",
              transition: "background 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#c82333")}
            onMouseLeave={(e) => (e.target.style.background = "#dc3545")}
          >
            Logout
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default ClerkDashboard;
