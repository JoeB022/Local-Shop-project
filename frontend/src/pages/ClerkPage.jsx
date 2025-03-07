import React, { useEffect, useState } from "react";
import {Spinner, Form, Button, Alert, Container, Row, Col,Card,} from "react-bootstrap";
// Replace with actual API calls if ready
const fetchOrders = async () => {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve([{ id: 1, description: "Order 1", status: "Pending" }]),
      1000
    );
  });
};

const recordItemDetails = async (itemDetails) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Recorded item details:", itemDetails);
      resolve("Item details recorded");
    }, 500);
  });
};

const requestSupply = async (itemDetails) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Supply requested for:", itemDetails);
      resolve("Supply request sent");
    }, 500);
  });
};

const ClerkPage = () => {
  const initialItemDetails = {
    itemsReceived: 0,
    paymentStatus: "not paid",
    itemsInStock: 0,
    itemsSpoilt: 0,
    buyingPrice: 0,
    sellingPrice: 0,
  };

  const [itemDetails, setItemDetails] = useState(initialItemDetails);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        setError("Error fetching orders");
      } finally {
        setLoadingOrders(false);
      }
    };
    getOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemDetails({
      ...itemDetails,
      [name]:
        name.includes("items") || name.includes("Price") ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await recordItemDetails(itemDetails);
      alert("Item details recorded successfully!");
      setItemDetails(initialItemDetails);
    } catch (error) {
      setError("Failed to record item details");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestSupply = async () => {
    setSubmitting(true);
    try {
      await requestSupply(itemDetails);
      alert("Supply request sent successfully!");
    } catch (error) {
      setError("Failed to request supply");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container
      className="mt-4 p-4"
      style={{
        background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
        borderRadius: "10px",
      }}
    >
      <h2 className="text-center text-primary mb-4">Clerk Dashboard</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow border-0">
            <Card.Body className="p-4">
              <h4 className="mb-3 text-center text-secondary">Add Item Details</h4>

              <Form onSubmit={handleSubmit}>
                {[
                  { label: "Items Received", name: "itemsReceived" },
                  { label: "Items in Stock", name: "itemsInStock" },
                  { label: "Items Spoilt", name: "itemsSpoilt" },
                  { label: "Buying Price", name: "buyingPrice" },
                  { label: "Selling Price", name: "sellingPrice" },
                ].map(({ label, name }) => (
                  <Form.Group className="mb-3" key={name}>
                    <Form.Label>{label}</Form.Label>
                    <Form.Control
                      type="number"
                      name={name}
                      value={itemDetails[name]}
                      onChange={handleInputChange}
                      placeholder={Enter` ${label.toLowerCase()}`}
                      required
                      className="shadow-sm"
                    />
                  </Form.Group>
                ))}

                <Form.Group className="mb-3">
                  <Form.Label>Payment Status</Form.Label>
                  <Form.Select
                    name="paymentStatus"
                    value={itemDetails.paymentStatus}
                    onChange={handleInputChange}
                    required
                    className="shadow-sm"
                  >
                    <option value="not paid">Not Paid</option>
                    <option value="paid">Paid</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                    className="py-2 fw-bold shadow-sm"
                  >
                    {submitting ? "Recording..." : "Record Item"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <div className="d-grid mt-3">
            <Button
              variant="warning"
              className="py-2 fw-bold shadow-sm"
              onClick={handleRequestSupply}
              disabled={submitting}
            >
              {submitting ? "Requesting..." : "Request Supply"}
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={8}>
          <Card className="shadow border-0">
            <Card.Body className="p-4">
              <h4 className="text-center text-secondary mb-3">Pending Orders</h4>
              {loadingOrders ? (
                <div className="d-flex justify-content-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <ul className="list-group">
                  {orders.map((order) => (
                    <li key={order.id} className="list-group-item d-flex justify-content-between">
                      <span>{order.description}</span>
                      <strong className="text-warning">{order.status}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ClerkPage;