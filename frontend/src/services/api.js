console.log("API functions loaded"); // Debugging

import { API_URL } from "../config";

// Mock user data for demonstration purposes
const mockUsers = [
  {
    name: "Admin User",
    email: "admin@localshop.com",
    password: "adminpass",
    role: "admin",
  },
  {
    name: "Clerk User",
    email: "clerk@localshop.com",
    password: "clerkpass",
    role: "clerk",
  },
  {
    name: "Merchant User",
    email: "merchant@localshop.com",
    password: "merchantpass",
    role: "merchant",
  },
];

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Register user
export const registerUser = async (userData) => {
  const token = localStorage.getItem("token"); // Get the JWT token from localStorage

  try {
    const response = await fetch(`${API_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json(); // Get response data

    if (!response.ok) {
      throw new Error(data.error || "Failed to register user");
    }

    alert(`Success: ${data.message}`); // Show success message
    return data; // Return data for further use
  } catch (error) {
    console.error("Error registering user:", error);
    alert(`Registration Failed: ${error.message}`); // Show error message
    throw error;
  }
};
// Register clerk
export const registerClerk = async (clerkData) => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/user/register_clerk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clerkData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to register clerk");
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering clerk:", error);
    throw error;
  }
};

//Login
export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to log in");
    }

    // Store the token and role in localStorage
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("role", data.role);

    // Redirect based on role
    if (data.role === "clerk") {
      window.location.href = "/clerk"; // Redirect clerks to the Clerk Dashboard
    } else if (data.role === "admin") {
      window.location.href = "/admin";
    } else if (data.role === "merchant") {
      window.location.href = "/merchant";
    } else {
      window.location.href = "/";
    }

    return { role: data.role };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Send reset password email
export const sendResetPasswordEmail = async (data) => {
  const { email } = data;
  const user = mockUsers.find((user) => user.email === email);
  if (!user) {
    return { success: false, message: "User not found" };
  }

  console.log(`Reset password email sent to: ${email}`);
  return { success: true, message: "Reset password email sent successfully" };
};

export const fetchAdminData = async () => {
  const response = await fetch(`${API_URL}/user/admin-data`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch admin data");
  return response.json();
};

export const fetchClerkData = async () => {
  const response = await fetch(`${API_URL}/user/clerk-data`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch clerk data");
  return response.json();
};

export const fetchMerchantData = async () => {
  const response = await fetch(`${API_URL}/user/merchant-data`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch merchant data");
  return response.json();
};

// Product Management
export const createProduct = async (productData) => {
  const headers = getAuthHeaders();

  try {
    const response = await fetch(`${API_URL}/products/create`, {
      method: "POST",
      headers,
      body: JSON.stringify(productData),
    });

    if (!response.ok) throw new Error("Failed to create product");

    return response.json();
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/product/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

export const getProduct = async (productId) => {
  const response = await fetch(`${API_URL}/product/${productId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
};

export const updateProduct = async (productId, productData) => {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error("Failed to update product");
  return response.json();
};

export const deleteProduct = async (productId) => {
  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders(), mode: "no-cors" },
  });
  if (!response.ok) throw new Error("Failed to delete product");
  return response.json();
};

// Stock Management
export const createStock = async (stockData) => {
  const response = await fetch(`${API_URL}/stock/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(stockData),
  });
  if (!response.ok) throw new Error("Failed to create stock");
  return response.json();
};

export const getStock = async (stockId) => {
  const response = await fetch(`${API_URL}/stock/${stockId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch stock");
  return response.json();
};

export const updateStock = async (stockId, stockData) => {
  const response = await fetch(`${API_URL}/stock/${stockId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(stockData),
  });
  if (!response.ok) throw new Error("Failed to update stock");
  return response.json();
};

export const deleteStock = async (stockId) => {
  const response = await fetch(`${API_URL}/stock/${stockId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete stock");
  return response.json();
};

// Store Management
export const createStore = async (storeData) => {
  try {
    const response = await fetch(`${API_URL}/stores/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(storeData),
    });
    if (!response.ok) throw new Error("Failed to create store");
    return response.json();
  } catch (error) {
    console.error("Error creating store:", error);
    throw error;
  }
};

export const getStores = async () => {
  const headers = getAuthHeaders();
  try {
    const response = await fetch(`${API_URL}/stores/all`, {
      method: "GET",
      headers,
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `Error fetching stores: ${errorData.message || "Unknown error"}`
      );
      console.error(errorData);
      throw new Error(
        `Failed to fetch stores: ${errorData.message || "Unknown error"}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
};

export const getStore = async (storeId) => {
  const response = await fetch(`${API_URL}/stores/${storeId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch store");
  return response.json();
};

export const updateStore = async (storeId, storeData) => {
  const response = await fetch(`${API_URL}/store/${storeId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(storeData),
  });
  if (!response.ok) throw new Error("Failed to update store");
  return response.json();
};

export const deleteStore = async (storeId) => {
  const response = await fetch(`${API_URL}/store/${storeId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete store");
  return response.json();
};

// Supply Requests
export const createSupplyRequest = async (supplyData) => {
  const response = await fetch(`${API_URL}/supply_request/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(supplyData),
  });
  if (!response.ok) throw new Error("Failed to create supply request");
  return response.json();
};

export const getSupplyRequest = async (requestId) => {
  const response = await fetch(`${API_URL}/supply_request/${requestId}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch supply request");
  return response.json();
};

export const updateSupplyRequest = async (requestId, updateData) => {
  const response = await fetch(`${API_URL}/supply_request/${requestId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });
  if (!response.ok) throw new Error("Failed to update supply request");
  return response.json();
};

export const deleteSupplyRequest = async (requestId) => {
  const response = await fetch(`${API_URL}/supply_request/${requestId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to delete supply request");
  return response.json();
};
