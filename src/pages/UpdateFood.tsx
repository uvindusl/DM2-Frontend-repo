import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";
import "../css/UpdateFood.css";
import EmployeeNavBar from "../components/EmployeeNavBar";
import SupplierNavBar from "../components/SupplierNavBar";

const UpdateFood: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [food, setFood] = useState({
    foodName: "",
    foodDescription: "",
    foodPrice: "",
    foodPic: "",
    foodCategory: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handlecancel = async () => {
    navigate("/employee/view/foods");
  };

  useEffect(() => {
    axios.get(`http://localhost:8080/urban-food/foods/${id}`).then((res) => {
      setFood(res.data);
      setPreview(
        res.data.picture ? `data:image/jpeg;base64,${res.data.picture}` : null
      );
    });
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("foodName", food.foodName);
    formData.append("foodDescription", food.foodDescription);
    formData.append("foodPrice", food.foodPrice);
    formData.append("foodCategory", food.foodCategory);
    if (image) formData.append("foodPic", image);

    try {
      await axios.put(
        `http://localhost:8080/urban-food/foods/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Food updated!");
      navigate("/supplier/view/foods");
    } catch (error) {
      console.error("Error updating food:", error);
      alert("Failed to update food.");
    }
  };

  return (
    <div>
      <SupplierNavBar />
      <div className="page-wrapper2">
        <h2 className="title">Update Food</h2>
        <div className="update-food-container">
          <form className="form-content" onSubmit={handleUpdate}>
            <label>Title:</label>
            <input
              type="text"
              value={food.foodName}
              onChange={(e) => setFood({ ...food, foodName: e.target.value })}
              required
            />
            <label>Category:</label>
            <select
              className="input-field"
              required
              onChange={(e) =>
                setFood({ ...food, foodCategory: e.target.value })
              }
              value={food.foodCategory}
            >
              <option value="fruits">fruits</option>
              <option value="vegetables">vegetables</option>
              <option value="dairy products">dairy products</option>
              <option value="baked goods">baked goods</option>
              <option value="handmade">handmade</option>
            </select>

            <label>Description:</label>
            <textarea
              value={food.foodDescription}
              onChange={(e) =>
                setFood({ ...food, foodDescription: e.target.value })
              }
              required
            ></textarea>

            <label>Price:</label>
            <input
              type="number"
              value={food.foodPrice}
              onChange={(e) => setFood({ ...food, foodPrice: e.target.value })}
              required
            />

            <label>Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files![0])}
            />
            {preview && (
              <img src={preview} alt="Preview" className="image-preview" />
            )}
            <div className="button-group">
              <button type="submit" className="update-button">
                Update
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={handlecancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UpdateFood;
