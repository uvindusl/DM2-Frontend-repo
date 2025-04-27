import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios, { AxiosError } from "axios";
import "../css/UpdateFood.css";
import EmployeeNavBar from "../components/EmployeeNavBar";
import SupplierNavBar from "../components/SupplierNavBar";

interface Food {
  foodName: string;
  foodDescription: string;
  foodPrice: string;
  foodPic?: string | null;
  foodCategory: string;
  foodSupId: string;
}

const UpdateFood: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [food, setFood] = useState<Food>({
    foodName: "",
    foodDescription: "",
    foodPrice: "",
    foodPic: null,
    foodCategory: "",
    foodSupId: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    navigate("/supplier/view/foods");
  };

  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<Food>(
          `http://localhost:8080/urban-food/foods/${id}`
        );
        console.log("Fetched Food Data:", response.data); // Debugging
        setFood(response.data);
        setPreview(
          response.data.foodPic
            ? `data:image/jpeg;base64,${response.data.foodPic}`
            : null
        );
      } catch (error: any) {
        console.error("Error fetching food:", error);
        setError("Failed to fetch food details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFood();
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFood((prevFood) => ({
      ...prevFood,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("foodName", food.foodName);
    formData.append("foodDescription", food.foodDescription);
    formData.append("foodPrice", food.foodPrice);
    formData.append("foodCategory", food.foodCategory);
    formData.append("foodSupplierId", food.foodSupId);

    if (image) {
      formData.append("foodPic", image);
    }

    for (const [key, value] of (formData as any).entries()) {
      console.log(`${key}:`, value); // Debugging FormData
    }

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
    } catch (error: any) {
      console.error("Error updating food:", error);
      setError("Failed to update food.");
      if (axios.isAxiosError(error)) {
        console.error("Axios Error Details:", error.response?.data);
        alert(
          `Failed to update food. Server responded with status: ${error.response?.status}`
        );
      } else {
        alert("Failed to update food. An unexpected error occurred.");
      }
    }
  };

  if (loading) {
    return <div>Loading food details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <SupplierNavBar />
      <div className="page-wrapper2">
        <h2 className="title">Update Food</h2>
        <div className="update-food-container">
          <form className="form-content" onSubmit={handleUpdate}>
            <label htmlFor="foodName">Title:</label>
            <input
              type="text"
              id="foodName"
              name="foodName"
              value={food.foodName}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="foodCategory">Category:</label>
            <select
              className="input-field"
              id="foodCategory"
              name="foodCategory"
              required
              onChange={handleInputChange}
              value={food.foodCategory}
            >
              <option value="">Select Category</option>
              <option value="fruits">fruits</option>
              <option value="vegetables">vegetables</option>
              <option value="dairy products">dairy products</option>
              <option value="baked goods">baked goods</option>
              <option value="handmade">handmade</option>
            </select>

            <label htmlFor="foodDescription">Description:</label>
            <textarea
              id="foodDescription"
              name="foodDescription"
              value={food.foodDescription}
              onChange={handleInputChange}
              required
            ></textarea>

            <label htmlFor="foodPrice">Price:</label>
            <input
              type="number"
              id="foodPrice"
              name="foodPrice"
              value={food.foodPrice}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="foodSupplierId">Supplier ID:</label>
            <input
              type="number"
              id="foodSupplierId"
              name="foodSupplierId"
              value={food.foodSupId}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="foodPic">Image:</label>
            <input
              type="file"
              id="foodPic"
              accept="image/*"
              onChange={handleImageChange}
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
                onClick={handleCancel}
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
