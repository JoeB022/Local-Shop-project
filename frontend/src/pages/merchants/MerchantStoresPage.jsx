import { useEffect, useState } from "react";
import { getStores, createStore } from "../../services/api";
import { Link } from "react-router-dom";

const MerchantStores = () => {
  const [stores, setStores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storeData, setStoreData] = useState({ name: "", address: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStores = async () => {
      try {
        const data = await getStores();
        console.log(data);
        setStores(data);
      } catch (error) {
        console.error(`Error fetching stores: ${error.message}`, { error });
      }
    };

    loadStores();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      await createStore({
        ...storeData,
      });
      setIsModalOpen(false);
      setStoreData({ name: "", address: "" });
      setError("");
      // Refresh the store list
      const updatedStores = await getStores();
      setStores(updatedStores);
    } catch (error) {
      setError("Failed to create store. Please try again.");
    }
  };

  return (
    <div className="w-full bg-white !p-6 flex flex-col gap-6">
      <header>
        <p className="text-2xl m-0 font-semibold tracking-tight">Stores</p>
        <p className="text-neutral-600">
          Manage and view all your stores and their details at a glance.
        </p>
      </header>
      <div className="w-full flex flex-col gap-4">
        <nav>
          <button
            className="h-8 p-0 px-3 rounded font-medium !text-sm"
            onClick={() => setIsModalOpen(true)}
          >
            Add Store
          </button>
        </nav>
        <div className="border !rounded-xl border-neutral-200">
          <table className="!w-full ">
            <thead className="!border-b !border-neutral-300 w-full">
              <tr className="w-full">
                <th className="w-1/4 text-neutral-600 px-3 py-1">Store name</th>
                <th className="w-1/4 text-neutral-600 px-3 py-1">
                  Store address
                </th>
                <th className="w-1/4 text-neutral-600 px-3 py-1">
                  Total products
                </th>
                <th className="w-1/4 text-neutral-600 px-3 py-1">
                  Total supply requests
                </th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store, index) => (
                <tr
                  key={store.id}
                  className={`${index % 2 === 0 ? "bg-neutral-100" : ""}`}
                >
                  <td className="px-3 py-2">
                    <Link to={`/merchant/stores/${store.id}`}>
                      {store.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{store.address}</td>
                  <td className="px-3 py-2">{store.product_count}</td>
                  <td className="px-3 py-2">{store.supply_request_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding new store */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-xl w-96 p-3">
            <p className="text-xl font-semibold tracking-tight mb-4">
              Add New Store
            </p>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <form onSubmit={handleCreateStore}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium">
                  Store Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={storeData.name}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium">
                  Store Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={storeData.address}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="h-8 p-0 px-3 rounded font-medium !text-sm bg-transparent !text-neutral-800"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 p-0 px-3 rounded font-medium !text-sm"
                >
                  Add Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantStores;
