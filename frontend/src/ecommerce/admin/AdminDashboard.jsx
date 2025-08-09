import React, { useState, useEffect } from "react";
import { ProductForm } from "./ProductForm";
import { ProductList } from "./ProductList";
import styles from "./AdminDashboard.module.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBox, FaHistory, FaSignOutAlt, FaPlus, FaList, FaWifi, FaTimes } from "react-icons/fa";
import { useSocket } from "../context/SocketContext";
import { RealTimeActivity } from "../components/RealTimeActivity";

export function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [activeSection, setActiveSection] = useState("products"); // "products" or "purchases"
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const navigate = useNavigate();
  const { 
    isConnected, 
    joinAdminRoom, 
    emitProductCreated, 
    emitProductUpdated, 
    emitProductDeleted,
    emitUserActivity 
  } = useSocket();

  console.log("purchase Data", purchases);

  useEffect(() => {
    getProducts();
    getPurchases();
    
    // Join admin room for real-time updates
    joinAdminRoom();
    
    // Emit user activity
    emitUserActivity({
      type: 'admin_login',
      timestamp: new Date(),
      details: 'Admin accessed dashboard'
    });
  }, []);

  const getProducts = () => {
    Axios.get("http://localhost:3001/api/products")
      .then((response) => {
        setProducts(response.data?.response || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPurchases = () => {
    Axios.get("http://localhost:3001/api/purchase")
      .then((response) => {
        console.log("API Response:", response.data);
        setPurchases(response.data?.result || []);
      })
      .catch((error) => {
        console.log("Error fetching purchases:", error);
      });
  };

  const [currentProduct, setCurrentProduct] = useState(null);

  const handleSubmit = async (productData) => {
    try {
    if (productData.id) {
        // Update existing product
        const response = await Axios.post("http://localhost:3001/api/updateproducts", productData);
      setProducts(
        products.map((product) =>
          product.id === productData.id
            ? { ...product, ...productData }
            : product
        )
      );
        emitProductUpdated(productData);
    } else {
        // Create new product
        const response = await Axios.post("http://localhost:3001/api/createproducts", productData);
        const newProduct = { ...productData, id: products.length + 1 };
        setProducts([...products, newProduct]);
        emitProductCreated(newProduct);
      }
      
      setCurrentProduct(null);
      setIsAddingProduct(false);
      
      // Emit user activity
      emitUserActivity({
        type: productData.id ? 'product_updated' : 'product_created',
        timestamp: new Date(),
        details: `Product ${productData.id ? 'updated' : 'created'}: ${productData.title}`
      });
      
    } catch (error) {
      console.error("Error handling product:", error);
    }
  };

  const handleUpdate = (id) => {
    const productToEdit = products.find((product) => product.id === id);
    setCurrentProduct(productToEdit);
    setIsAddingProduct(true);
  };

  const handleDelete = async (id) => {
    try {
      await Axios.post("http://localhost:3001/api/deleteproducts", { id });
    setProducts(products.filter((product) => product.id !== id));
      emitProductDeleted(id);
      
      // Emit user activity
      emitUserActivity({
        type: 'product_deleted',
        timestamp: new Date(),
        details: `Product deleted: ID ${id}`
      });
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.setItem("isLoggedIn", "false");
    navigate("/login");
  };

  const handleAddNewProduct = () => {
    setCurrentProduct(null);
    setIsAddingProduct(true);
    setActiveSection("products");
  };

  return (
    <div className={styles.adminDashboard}>
      {/* Header */}
      <header className={styles.adminHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.adminTitle}>
            <span className={styles.adminIcon}>👑</span>
            Admin Dashboard
          </h1>
          <div className={styles.headerActions}>
            <div className={styles.connectionStatus}>
              {isConnected ? (
                <FaWifi size={16} color="#4caf50" />
              ) : (
                <FaTimes size={16} color="#f44336" />
              )}
              <span>{isConnected ? "Connected" : "Disconnected"}</span>
            </div>
            <button className={styles.logoutButton} onClick={handleLogout}>
              <FaSignOutAlt size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className={styles.navigationTabs}>
        <button
          className={`${styles.tabButton} ${activeSection === "products" ? styles.activeTab : ""}`}
          onClick={() => setActiveSection("products")}
        >
          <FaBox size={18} />
          Product Management
        </button>
        <button
          className={`${styles.tabButton} ${activeSection === "purchases" ? styles.activeTab : ""}`}
          onClick={() => setActiveSection("purchases")}
        >
          <FaHistory size={18} />
          Purchase History
        </button>
      </div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Real-time Activity Component */}
        <RealTimeActivity />
        
        {activeSection === "products" && (
          <div className={styles.productsSection}>
            {/* Section Header */}
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FaBox size={24} />
                Product Management
              </h2>
              <button 
                className={styles.addProductButton}
                onClick={handleAddNewProduct}
              >
                <FaPlus size={16} />
                Add New Product
              </button>
            </div>

            {/* Product Form */}
            {isAddingProduct && (
              <div className={styles.formContainer}>
      <ProductForm onSubmit={handleSubmit} currentProduct={currentProduct} />
              </div>
            )}

            {/* Product List */}
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                <h3 className={styles.listTitle}>
                  <FaList size={20} />
                  Current Products ({products.length})
                </h3>
              </div>
      <ProductList
        products={products}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
            </div>
          </div>
        )}

        {activeSection === "purchases" && (
          <div className={styles.purchasesSection}>
            {/* Section Header */}
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FaHistory size={24} />
                Purchase History
              </h2>
            </div>

            {/* Purchase History */}
      <div className={styles.purchaseHistory}>
          {purchases.length > 0 ? (
                <div className={styles.purchaseGrid}>
                  {purchases.map((purchase, index) => (
              <div
                key={purchase.purchaseId}
                      className={styles.purchaseCard}
              >
                      <div className={styles.purchaseHeader}>
                        <h4 className={styles.purchaseId}>
                          Purchase ID: {purchase.purchaseId}
                        </h4>
                        <span className={styles.purchaseDate}>
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className={styles.tableWrapper}>
                <table className={styles.historyTable}>
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Size</th>
                      <th>Price</th>
                      <th>Quantity</th>
                              <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchase.items.map((item, index) => (
                      <tr key={item._id}>
                        <td>{item.title}</td>
                        <td>{item.size}</td>
                                <td>Rs {item.price}</td>
                        <td>{item.quantity}</td>
                                <td>Rs {item.price * item.quantity}</td>
                      </tr>
                    ))}
                            <tr className={styles.totalRow}>
                              <td colSpan="4" className={styles.totalLabel}>
                        Total Price:
                      </td>
                              <td className={styles.totalAmount}>
                                Rs {calculateTotalPrice(purchase.items)}
                              </td>
                    </tr>
                  </tbody>
                </table>
              </div>
                    </div>
                  ))}
                </div>
          ) : (
                <div className={styles.noData}>
                  <div className={styles.noDataIcon}>📦</div>
                  <p>No purchase history available.</p>
                </div>
          )}
        </div>
      </div>
        )}
    </main>
    </div>
  );
}
