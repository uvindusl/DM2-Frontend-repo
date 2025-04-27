import "../css/MostSoldProducts.css";
import React, { useState, useEffect } from "react";

interface MostSoldProduct {
  foodId: number;
  totalSold: number;
}

interface FoodDetails {
  foodId: number;
  foodName: string;
  foodDescription: string;
  foodPic: string;
  foodPrice: number;
  foodCategory: any | null;
  foodSupId: number;
}

function MostSoldProducts() {
  const [mostSoldProducts, setMostSoldProducts] = useState<MostSoldProduct[]>(
    []
  );
  const [foodDetails, setFoodDetails] = useState<{
    [key: number]: FoodDetails;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMostSold = async () => {
      try {
        const mostSoldResponse = await fetch(
          "http://localhost:8080/urban-food/suborders/mostSold"
        );
        if (!mostSoldResponse.ok) {
          throw new Error(`HTTP error! status: ${mostSoldResponse.status}`);
        }
        const mostSoldData: MostSoldProduct[] = await mostSoldResponse.json();
        setMostSoldProducts(mostSoldData);
        setLoading(false);
      } catch (e: any) {
        setError(e);
        setLoading(false);
      }
    };

    fetchMostSold();
  }, []);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      if (mostSoldProducts.length > 0) {
        const details: { [key: number]: FoodDetails } = {};
        for (const product of mostSoldProducts) {
          try {
            const foodDetailsResponse = await fetch(
              `http://localhost:8080/urban-food/foods/${product.foodId}`
            );
            if (!foodDetailsResponse.ok) {
              throw new Error(
                `HTTP error! status: ${foodDetailsResponse.status}`
              );
            }
            const foodData: FoodDetails = await foodDetailsResponse.json();
            details[product.foodId] = foodData;
          } catch (e: any) {
            console.error(
              `Error fetching details for food ID ${product.foodId}:`,
              e
            );
          }
        }
        setFoodDetails(details);
      }
    };

    fetchFoodDetails();
  }, [mostSoldProducts]);

  if (loading) {
    return <div>Loading most sold products...</div>;
  }

  if (error) {
    return <div>Error loading most sold products: {error.message}</div>;
  }

  return (
    <div className="Most-Sold-Products-container">
      <h2 className="Most-Sold-Products-title">Most Sold Products</h2>
      <div className="Most-Sold-Products-grid">
        {mostSoldProducts.map((product) => {
          const food = foodDetails[product.foodId];
          const imageSource = food?.foodPic
            ? `data:image/jpeg;base64,${food.foodPic}`
            : "/placeholder.png";

          return (
            <div className="Most-Sold-Product-card" key={product.foodId}>
              <div className="Most-Sold-Products-details">
                <img
                  src={imageSource}
                  alt={food?.foodName || "Product"}
                  className="Most-Sold-Products-image"
                />
                <p className="Most-Sold-Products-name">
                  {food?.foodName || "Loading..."}
                </p>
                <br />
                <br />
                <p className="Most-Sold-Products-qty">
                  Sold {product.totalSold} items
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MostSoldProducts;
