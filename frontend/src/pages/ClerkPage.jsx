import React, { useEffect, useState } from "react";
import { Spinner, Form, Button, Alert, Container, Row, Col } from "react-bootstrap";

// Replace with actual API calls if ready
const fetchOrders = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([{ id: 1, description: "Order 1", status: "Pending" }]), 1000);
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
      [name]: name.includes("items") || name.includes("Price") ? Number(value) : value,
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
    <Container className="mt-2">
      <h2 className="text-center mb-2">Clerk Dashboard</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Form Section */}
      <Row className="justify-content-center">
        <Col md={8}>
          <Form onSubmit={handleSubmit} className="p-4 border rounded shadow">
            <h4 className="mb-3">Add Item Details</h4>

            <Form.Group className="mb-3">
              <Form.Label>Items Received</Form.Label>
              <Form.Control
                type="number"
                name="itemsReceived"
                value={itemDetails.itemsReceived}
                onChange={handleInputChange}
                placeholder="Enter number of items received"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Payment Status</Form.Label>
              <Form.Select name="paymentStatus" value={itemDetails.paymentStatus} onChange={handleInputChange} required>
                <option value="not paid">Not Paid</option>
                <option value="paid">Paid</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Items in Stock</Form.Label>
              <Form.Control
                type="number"
                name="itemsInStock"
                value={itemDetails.itemsInStock}
                onChange={handleInputChange}
                placeholder="Enter number of items in stock"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Items Spoilt</Form.Label>
              <Form.Control
                type="number"
                name="itemsSpoilt"
                value={itemDetails.itemsSpoilt}
                onChange={handleInputChange}
                placeholder="Enter number of items spoilt"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Buying Price</Form.Label>
              <Form.Control
                type="number"
                name="buyingPrice"
                value={itemDetails.buyingPrice}
                onChange={handleInputChange}
                placeholder="Enter buying price"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Selling Price</Form.Label>
              <Form.Control
                type="number"
                name="sellingPrice"
                value={itemDetails.sellingPrice}
                onChange={handleInputChange}
                placeholder="Enter selling price"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? "Recording..." : "Record Item"}
            </Button>
          </Form>

          <Button variant="warning" className="mt-3 w-100" onClick={handleRequestSupply} disabled={submitting}>
            {submitting ? "Requesting..." : "Request Supply"}
          </Button>
        </Col>
      </Row>

      {/* Orders Section */}
      <Row className="mt-5">
        <Col>
          <h4>Pending Orders</h4>
          {loadingOrders ? (
            <Spinner animation="border" />
          ) : (
            <ul className="list-group">
              {orders.map((order) => (
                <li key={order.id} className="list-group-item">
                  {order.description} - <strong>{order.status}</strong>
                </li>
              ))}
            </ul>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ClerkPage;