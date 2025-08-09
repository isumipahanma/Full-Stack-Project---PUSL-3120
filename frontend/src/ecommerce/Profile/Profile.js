import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import { fetchpurchaseData } from "./userService";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEdit, FaSave, FaTimes } from "react-icons/fa"; // Import icons

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [originalData, setOriginalData] = useState({});

  const [purchasesData, setpurchasesData] = useState([]);
  const [parsedUserid, setParsedUserid] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData(parsedUser);
      setOriginalData(parsedUser);
      setParsedUserid(parsedUser.id);
    }
  }, []);

  useEffect(() => {
    const getPurchase = async () => {
      try {
        const data = await fetchpurchaseData();
        if (data && Array.isArray(data.result)) {
          const filteredPurchases = data.result
            .map((purchase) => ({
              purchaseId: purchase.purchaseId,
              items: purchase.items.filter(
                (item) => item.userid === parsedUserid
              ),
            }))
            .filter((purchase) => purchase.items.length > 0);

          setpurchasesData(filteredPurchases);
        }
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };

    if (parsedUserid) {
      getPurchase();
    }
  }, [parsedUserid]);

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    navigate("/");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - restore original data
      setFormData(originalData);
    }
    setIsEditing(!isEditing);
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    
    try {
      // Simulate API call for updating profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local storage with new data
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setOriginalData(formData);
      
      // Exit editing mode
      setIsEditing(false);
      
      // Show success message (you can add a toast notification here)
      console.log("Profile updated successfully!");
      
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (e) => {
    if (isEditing) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          &#8592; Back
        </button>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {user ? (
        <>
          <div className={styles.profileContainer}>
            <div className={styles.profileImageContainer}>
              <div className={styles.profileImage}>
                <FaUser size={60} />
              </div>
              <div className={styles.editIcon} onClick={handleEditToggle}>
                {isEditing ? <FaTimes size={20} /> : <FaEdit size={20} />}
              </div>
            </div>
            
            <div className={styles.profileDetails}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className={`${styles.inputField} ${!isEditing ? styles.disabled : ''}`}
                  disabled={!isEditing}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className={`${styles.inputField} ${!isEditing ? styles.disabled : ''}`}
                  disabled={!isEditing}
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className={`${styles.inputField} ${!isEditing ? styles.disabled : ''}`}
                  disabled={!isEditing}
                />
              </div>
              
              {isEditing && (
                <button 
                  className={styles.updateButton} 
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <span className={styles.loadingSpinner}></span>
                  ) : (
                    <>
                      <FaSave size={16} />
                      Update Profile
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className={styles.purchaseHistory}>
            <h3 className={styles.sectionTitle}>Purchase History</h3>
            <div className={styles.historyContainer}>
              {purchasesData.length > 0 ? (
                purchasesData.map((purchase, index) => (
                  <div
                    key={purchase.purchaseId}
                    className={styles.purchaseContainer}
                  >
                    <h4 className={styles.purchaseTitle}>Purchase ID: {purchase.purchaseId}</h4>
                    <div className={styles.tableWrapper}>
                      <table className={styles.historyTable}>
                        <thead>
                          <tr>
                            <th>Item Name</th>
                            <th>Size</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
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
                ))
              ) : (
                <div className={styles.noHistory}>
                  <p>No purchase history available for this user.</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};
