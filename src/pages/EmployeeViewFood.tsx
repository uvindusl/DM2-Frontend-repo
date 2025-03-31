import { useState, useEffect } from "react";
import FoodGrid from "../components/FoodGrid";
import "../css/EmployeeViewFood.css";
import axios from "axios";
import Footer from "../components/Footer";
import EmployeeNavBar from "../components/EmployeeNavBar";

interface Food {
  id: number;
  name: string;
  description: string;
  picture: string;
  price: number;
}

function EmployeeViewFood() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const DeleteClick = async (id: number) => {
    try {
      const apiUrl = `http://localhost:8081/food-micro/foods/${id}`;
      await axios.delete(apiUrl);
      window.location.reload();
      console.log(apiUrl);
    } catch (error) {
      console.error("Error", error);
      setError("Failed to delete");
    }
  };

  useEffect(() => {
    const apiUrl = "http://localhost:8081/food-micro/foods";

    setLoading(true);
    axios
      .get(apiUrl)
      .then((response) => {
        if (response.status === 200) {
          setFoods(response.data);
        } else if (response.status === 204) {
          setFoods([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching food data:", error);
        setError("Failed to load food items. Please try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <EmployeeNavBar />
      <div className="food-grid-page-evf">
        {loading ? (
          <p className="loading-message">Loading menu items...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="food-grid-evf">
            {foods.map((food) => {
              console.log("Food in map:", food);
              return (
                <FoodGrid
                  key={food.id}
                  food={food}
                  handleDeleteClick={DeleteClick}
                />
              );
            })}
          </div>
        )}
      </div>
      <div className="footer4">
        <Footer />
      </div>
    </>
  );
}

export default EmployeeViewFood;
