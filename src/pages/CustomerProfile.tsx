import { useState, useEffect } from "react";
import "../css/CustomerProfile.css";
import NavBar from "../components/navBar";
import Footer from "../components/Footer";

interface Customer {
  id: number;
  customerId: number; // Added to match the backend data
  customerName: string; // Changed from 'name'
  customerAddress: string; // Changed from 'address'
  customerTel: string; // Changed from 'tel'
}

const CustomerProfile = () => {
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Customer | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      setIsLoading(true);
      const customerId = sessionStorage.getItem("customerId");
      console.log("Customer ID from sessionStorage:", customerId);

      if (!customerId) {
        throw new Error("Customer ID not found. Please log in again.");
      }

      const response = await fetch(
        `http://localhost:8080/urban-food/customers/${customerId}`
      );

      console.log("Fetch Response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to load profile data:", errorData);
        throw new Error(
          `Failed to load profile data. Status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Fetched Customer Data:", data);
      setCustomer(data as Customer); // Cast the data to the updated Customer interface
      setFormData(data as Customer); // Cast the data to the updated Customer interface
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8080/urban-food/customers/${formData.customerId}`, // Use customerId from the backend data
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Construct the body with the backend property names
            customerId: formData.customerId,
            customerName: formData.customerName,
            customerAddress: formData.customerAddress,
            customerTel: formData.customerTel,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update profile. Status: ${response.status}`);
      }

      const updatedCustomer = await response.json();
      setCustomer(updatedCustomer as Customer); // Cast the updated data
      setUpdateSuccess(true);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !customer) {
    return (
      <div className="customer-profile-container">
        <div className="loading-spinner">Loading profile information...</div>
      </div>
    );
  }

  if (error && !customer) {
    return (
      <div className="customer-profile-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={fetchCustomerData}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div className="customer-profile-container">
        <div className="profile-header">
          <h1>Your Profile</h1>
          {!isEditing && (
            <button className="btn-edit" onClick={toggleEdit}>
              Edit Profile
            </button>
          )}
        </div>

        {updateSuccess && (
          <div className="success-message">Profile updated successfully!</div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="customerName">Full Name</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData?.customerName || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerAddress">Address</label>
              <textarea
                id="customerAddress"
                name="customerAddress"
                value={formData?.customerAddress || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerTel">Phone Number</label>
              <input
                type="tel"
                id="customerTel"
                name="customerTel"
                value={formData?.customerTel || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={toggleEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-group">
              <h3>Full Name</h3>
              <p>{customer?.customerName}</p>
            </div>

            <div className="detail-group">
              <h3>Address</h3>
              <p>{customer?.customerAddress}</p>
            </div>

            <div className="detail-group">
              <h3>Phone Number</h3>
              <p>{customer?.customerTel}</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CustomerProfile;
