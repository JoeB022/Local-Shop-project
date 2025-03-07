import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStore, createProduct, updateProduct, deleteProduct } from "../../services/api";
import { MapPin, Pencil, Trash } from "lucide-react";
import Modal from "../../components/Modal";

const MerchantStoreDetails = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    buying_price: "",
    selling_price: "",
  });

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await getStore(storeId);
        setStore(response);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStoreData();
  }, [storeId]);

  const [error, setError] = useState(null);

  const handleAddProduct = async () => {
    try {
      await createProduct({ ...newProduct, store_id: storeId }); // Assuming createProduct API call
      setShowModal(false);
      setNewProduct({ name: "", buying_price: "", selling_price: "" });
      setError(null);
      // Fetch updated store data (or just append the new product to the list)
      const response = await getStore(storeId);
      setStore(response);
    } catch (error) {
      console.error("Error creating product:", error);
      setError(error.message);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewProduct({ name: "", buying_price: "", selling_price: "" });
  };

  const [editModal, setEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const closeEditModal = () => {
    setEditModal(false);
    setEditProduct(null);
  };

  const handleUpdateProduct = async () => {
    try {
      const updatedProduct = {
        name: editProduct.name,
        buying_price: editProduct.buying_price,
        selling_price: editProduct.selling_price,
      };
      await updateProduct(editProduct.id, updatedProduct); // Using updateProduct API call
      // Fetch updated store data to reflect the changes
      const response = await getStore(storeId);
      setStore(response);
      setEditModal(false);
      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      setError(error.message);
    }
  };

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteProduct, setSelectedDeleteProduct] = useState(null);

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(selectedDeleteProduct.id); // Using deleteProduct API call
      // Fetch updated store data to reflect the changes
      const response = await getStore(storeId);
      setStore(response);
      setDeleteModal(false);
      setSelectedDeleteProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      setError(error.message);
    }
  };

  const openDeleteModal = (product) => {
    setSelectedDeleteProduct(product);
    setDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedDeleteProduct(null);
  };
  if (!store) {
    return <div>Loading...</div>;
  }

  return (
    <div className="!p-6 flex flex-col !gap-10">
      <header>
        <p className="text-3xl font-semibold tracking-tight">{store.name}</p>
        <p className="flex items-center gap-2">
          <MapPin size={16} />
          {store.address}
        </p>
      </header>

      {/* Products Table */}
      <div className="">
        <div className="flex w-full justify-between items-center">
          <p className="text-xl tracking-tight font-semibold mb-3">Products</p>
          <button
            onClick={() => setShowModal(true)}
            className="h-8 p-0 px-3 mb-3 rounded font-medium !text-sm"
          >
            Add Product
          </button>
        </div>
        <table className="w-full border-collapse border border-neutral-300">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Buying Price</th>
              <th className="px-4 py-2 border">Selling Price</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {store.products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-2 border">{product.name}</td>
                <td className="px-4 py-2 border">{product.buying_price}</td>
                <td className="px-4 py-2 border">{product.selling_price}</td>
                <td className="px-4 py-2 border flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditProduct(product);
                      setEditModal(true);
                    }}
                    className="!size-6 !bg-transparent !text-neutral-600 !m-0 !p-0 grid place-items-center  hover:!text-black rounded"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => {
                      openDeleteModal(product);
                    }}
                    className="!size-6 !bg-transparent !text-neutral-600 !m-0 !p-0 grid place-items-center  hover:!text-black rounded ml-2"
                  >
                    <Trash size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Supply Requests Table */}
      <div className="">
        <p className="text-xl tracking-tight font-semibold mb-3">
          Supply requests
        </p>
        <table className="w-full border-collapse border border-neutral-300">
          <thead className="bg-neutral-100">
            <tr>
              <th className="px-4 py-2 border">Product ID</th>
              <th className="px-4 py-2 border">Requested Quantity</th>
              <th className="px-4 py-2 border">Received Quantity</th>
            </tr>
          </thead>
          <tbody>
            {store.supply_requests.map((request) => (
              <tr key={request.id}>
                <td className="px-4 py-2 border">{request.product_id}</td>
                <td className="px-4 py-2 border">
                  {request.requested_quantity}
                </td>
                <td className="px-4 py-2 border">
                  {request.received_quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for adding new product */}
      {editModal && (
        <Modal closeModal={closeEditModal}>
          <div className="p-4 w-full max-w-sm bg-white rounded-xl">
            <p className="text-xl font-semibold tracking-tight mb-4">
              Edit Product
            </p>
            <p className="text-red-500">{error}</p>
            <form onSubmit={handleUpdateProduct}>
              <label className="block mb-2">
                <span className="block text-sm font-medium text-gray-700">
                  Product Name
                </span>
                <input
                  type="text"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                  className="mt-1 px-2 py-2 border border-neutral-300 w-full"
                  required
                />
              </label>
              <label className="block mb-2">
                <span className="block text-sm font-medium text-gray-700">
                  Buying Price
                </span>
                <input
                  type="number"
                  value={editProduct.buying_price}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      buying_price: e.target.value,
                    })
                  }
                  required
                  className="mt-1 px-2 py-2 border border-neutral-300 w-full"
                />
              </label>
              <label className="block mb-4">
                <span className="block text-sm font-medium text-gray-700">
                  Selling Price
                </span>
                <input
                  type="number"
                  value={editProduct.selling_price}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      selling_price: e.target.value,
                    })
                  }
                  required
                  className="mt-1 px-2 py-2 border border-neutral-300 w-full"
                />
              </label>
              <br />
              <button
                type="submit"
                className="px-4 py-2 w-full bg-blue-600 text-white rounded"
              >
                Edit Product
              </button>
            </form>
          </div>
        </Modal>
      )}
      {showModal && (
        <Modal closeModal={handleModalClose}>
          <div className="p-4 w-full max-w-sm bg-white rounded-xl">
            <p className="text-xl font-semibold tracking-tight mb-4">
              Add Product
            </p>
            <p className="text-red-500">{error}</p>
            <form onSubmit={handleAddProduct}>
              <label className="block mb-2">
                <span className="block text-sm font-medium text-gray-700">
                  Product Name
                </span>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="mt-1 px-2 py-2 border border-neutral-300 w-full"
                  required
                />
              </label>
              <label className="block mb-2">
                <span className="block text-sm font-medium text-gray-700">
                  Buying Price
                </span>
                <input
                  type="number"
                  value={newProduct.buying_price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      buying_price: e.target.value,
                    })
                  }
                  required
                  className="mt-1 px-2 py-2 border border-neutral-300 w-full"
                />
              </label>
              <label className="block mb-4">
                <span className="block text-sm font-medium text-gray-700">
                  Selling Price
                </span>
                <input
                  type="number"
                  value={newProduct.selling_price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      selling_price: e.target.value,
                    })
                  }
                  required
                  className="mt-1 px-2 py-2 border border-neutral-300 w-full"
                />
              </label>
              <br />
              <button
                type="submit"
                className="px-4 py-2 w-full bg-blue-600 text-white rounded"
              >
                Add Product
              </button>
            </form>
          </div>
        </Modal>
      )}

      {deleteModal && (
        <Modal closeModal={closeDeleteModal}>
          <div className="p-4 w-full max-w-sm bg-white rounded-xl flex flex-col gap-6">
            <header className="flex flex-col gap-1">
              <p className="text-xl p-0 font-semibold tracking-tight">
                Remove Product
              </p>
              <p>
                Are you sure you want to remove{" "}
                <b>{selectedDeleteProduct.name}</b>?
              </p>
            </header>
            <button
              onClick={handleDeleteProduct}
              type="submit"
              className="px-4 py-2 w-full !bg-red-500 text-white rounded"
            >
              Delete Product
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MerchantStoreDetails;
