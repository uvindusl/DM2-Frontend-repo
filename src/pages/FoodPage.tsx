import { useState, useEffect } from "react";
import FoodPurchasePanel from "../components/FoodPurchasePanel";
import NavBar from "../components/navBar";
import "../css/FoodPage.css";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import axios from "axios";

// Define the Food interface
interface Food {
  foodId: number;
  foodPic: string; // Base64 string for the image
  foodName: string;
  foodPrice: number;
  foodDescription: string;
  foodCategory: string;
  foodSupId: number;
}

function FoodPage() {
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL
  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid food ID");
      setLoading(false);
      return;
    }

    const apiUrl = `http://localhost:8080/urban-food/foods/${id}`;

    setLoading(true);
    axios
      .get(apiUrl)
      .then((response) => {
        if (response.status === 200) {
          const foodData = response.data; //to store the food data
          setFood(foodData);

          sessionStorage.setItem("foodID", foodData.foodId.toString());
          // console.log(id);
        } else if (response.status === 404) {
          setFood(null); // Food not found
        } else {
          setError("Failed to load food details.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching food data:", error);
        setError("Failed to load food details. Please try again later.");
        setLoading(false);
      });
  }, [id]);

  return (
    <div>
      <NavBar />
      <div className="container" style={{ marginTop: "2rem" }}>
        {loading ? (
          <p>Loading food details...</p>
        ) : error ? (
          <p>{error}</p>
        ) : food ? (
          <FoodPurchasePanel food={food} supplier={undefined} />
        ) : (
          <p>Food not found</p>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default FoodPage;
