import { useState, useEffect } from "react";
import FoodPurchasePanel from "../components/FoodPurchasePanel";
import NavBar from "../components/navBar";
import "../css/FoodPage.css";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import axios from "axios";

// Define the Food interface
interface Food {
  id: number;
  picture: string; // Base64 string for the image
  name: string;
  price: number;
  description: string;
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

    const apiUrl = `http://localhost:8081/food-micro/foods/${id}`;

    setLoading(true);
    axios
      .get(apiUrl)
      .then((response) => {
        if (response.status === 200) {
          const foodid = response.data; //to store the food id
          setFood(response.data);

          //store customer id in sessionstorage
          sessionStorage.setItem("foodID", foodid.id.toString());
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
          <FoodPurchasePanel food={food} />
        ) : (
          <p>Food not found</p>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default FoodPage;
