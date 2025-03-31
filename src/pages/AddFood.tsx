import React, { useState } from "react";
import Footer from "../components/Footer";
import "../css/AddFood.css";
import EmployeeNavBar from "../components/EmployeeNavBar";
import { useNavigate } from "react-router-dom";

const AddFood: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlecancel = async () => {
    navigate("/employee/dashboard");
  };

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Handle Form Submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!image) {
      alert("Please upload an image.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("picture", image);

    try {
      const response = await fetch("http://localhost:8081/food-micro/foods", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
        setTitle("");
        setDescription("");
        setPrice("");
        setImage(null);
        setPreview(null);
      } else {
        alert("Failed to add food item.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the food item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <EmployeeNavBar />
      <div className="page-wrapper">
        <div className="add-food-container">
          <div className="form-box">
            <h2 className="form-title">Add Food</h2>
            <form className="form-content1" onSubmit={handleSubmit}>
              <div className="form-content">
                <div className="form-left">
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                    required
                  />

                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea-field"
                    required
                  ></textarea>

                  <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d{0,2}$/.test(value)) {
                        setPrice(value);
                      }
                    }}
                    className="input-field"
                    required
                  />
                </div>

                <div className="form-right">
                  <div className="image-box">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="image-preview"
                      />
                    ) : (
                      <p className="image-placeholder">Upload an Image</p>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  <div className="button-group">
                    <button
                      type="submit"
                      className="save-button"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={handlecancel}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="footer9">
        <Footer />
      </div>
      <div>
        {showSuccessPopup && (
          <div className="success-popup">Successfully add Food!</div>
        )}
      </div>
    </div>
  );
};

export default AddFood;
