import { useState, useEffect } from "react";
import NavBar from "../components/navBar";
import PizzaCard from "../components/PizzaCard";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import "../css/HomePage.css";
import axios from "axios";

interface Food {
  id: number;
  picture: string;
  name: string;
  price: number;
}

function HomePage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = (query: string = "") => {
    setLoading(true);
    const apiUrl = `http://localhost:8081/food-micro/foods/search?name=${query}`;

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
  };

  const handleSearch = (query: string) => {
    fetchFoods(query);
  };

  return (
    <div className="home">
      <NavBar />
      <div className="home-container">
        <h1 className="home-title">Our Pizza Menu</h1>
        <div className="search-wrapper">
          <SearchBar onSearch={handleSearch} />
        </div>
        {loading ? (
          <p className="loading-message">Loading menu items...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="food-grid">
            {foods.map((food) => (
              <PizzaCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
