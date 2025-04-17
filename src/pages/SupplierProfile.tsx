import { useState, useEffect } from "react";
import "../css/CustomerProfile.css";
import NavBar from "../components/navBar";
import Footer from "../components/Footer";

interface Supplier {
  id: number;
  supplierId: number;
  name: string;
  address: string;
  tell: string;
  company?: string;
  password?: string;
}

const SupplierProfile = () => {
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Supplier | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    fetchSupplierData();
  }, []);

  const fetchSupplierData = async () => {
    try {
      setIsLoading(true);
      const supplierId = sessionStorage.getItem("supplierId");

      if (!supplierId) {
        throw new Error("Supplier ID not found. Please log in again.");
      }

      const response = await fetch(
        `http://localhost:8080/urban-food/suppliers/${supplierId}`
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
      console.log("Fetched Supplier Data:", data);
      setSupplier(data as Supplier);
      setFormData(data as Supplier);
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
      const supplierId = sessionStorage.getItem("supplierId");

      if (!supplierId) {
        throw new Error("Supplier ID not found. Please log in again.");
      }

      const response = await fetch(
        `http://localhost:8080/urban-food/suppliers/${supplierId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            address: formData.address,
            tell: formData.tell,
            company: formData.company,
            password: formData.password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update profile. Status: ${response.status}`);
      }

      const updatedSupplier = await response.json();
      setSupplier(updatedSupplier as Supplier);
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

  if (isLoading && !supplier) {
    return (
      <div className="customer-profile-container">
        {" "}
        <div className="loading-spinner">Loading profile information...</div>
      </div>
    );
  }

  if (error && !supplier) {
    return (
      <div className="customer-profile-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={fetchSupplierData}>
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
        {" "}
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
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData?.name || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="supplierAddress">Address</label>
              <textarea
                id="supplierAddress"
                name="address"
                value={formData?.address || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="supplierTel">Phone Number</label>
              <input
                type="tel"
                id="supplierTel"
                name="tell"
                value={formData?.tell || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            {formData?.company && (
              <div className="form-group">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {formData?.password && (
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            )}

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
              <p>{supplier?.name}</p>
            </div>

            <div className="detail-group">
              <h3>Address</h3>
              <p>{supplier?.address}</p>
            </div>

            <div className="detail-group">
              <h3>Phone Number</h3>
              <p>{supplier?.tell}</p>
            </div>
            {supplier?.company && (
              <div className="detail-group">
                <h3>Company</h3>
                <p>{supplier.company}</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SupplierProfile;
