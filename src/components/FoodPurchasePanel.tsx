import "../css/FoodPurchasePanel.css";
import { useState } from "react";

interface Food {
  id: number;
  picture: string;
  name: string;
  price: number;
  description: string;
}

interface FoodPurchasePanelProps {
  food: Food;
}

function FoodPurchasePanel({ food }: FoodPurchasePanelProps) {
  const [count, setCount] = useState(0);
  const [addtocartloading, setaddtocartloading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // New state
  const [showUnSuccessPopup, setShowUnSuccessPopup] = useState(false); // New state

  const customerid = sessionStorage.getItem("customerId");
  console.log("Customer ID: ", customerid);

  const handleaddtocart = async () => {
    if (count === 0) {
      setShowUnSuccessPopup(true); // Show the popup
      setTimeout(() => setShowUnSuccessPopup(false), 3000); // Hide after 3 seconds
    } else {
      setaddtocartloading(true);
      try {
        const total = food.price * count;
        const response = await fetch(
          "http://localhost:8083/order-micro/carts",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customerId: customerid,
              foodId: food.id,
              quantity: count,
              subTotal: total,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log("Add to cart result:", result);

        setShowSuccessPopup(true); // Show the popup
        setTimeout(() => setShowSuccessPopup(false), 3000); // Hide after 3 seconds
      } catch (error) {
        console.error("Error adding to cart:", error);
      } finally {
        setaddtocartloading(false);
      }
    }
  };

  const imageSource = food.picture
    ? `data:image/jpeg;base64,${food.picture}`
    : "/placeholder.png";

  return (
    <div>
      <div className="product-card">
        <div className="product-image">
          <img src={imageSource} alt={food.name} />
        </div>
        <div className="product-details">
          <div className="product-info">
            <div className="product-info-label">Name</div>
            <div className="product-info-value">{food.name}</div>

            <div className="product-info-label">Description</div>
            <div className="product-info-value">{food.description}</div>

            <div className="product-info-label">Price</div>
            <div className="product-info-value">{food.price}</div>

            <div className="product-info-label">Quantity</div>
            <div className="quantity-selector">
              <button
                className="btn1"
                onClick={() => setCount((count) => count + 1)}
              >
                +
              </button>
              <button
                className="btn2"
                onClick={() => setCount((count) => (count > 0 ? count - 1 : 0))}
              >
                -
              </button>
              {count}
            </div>
          </div>

          <div className="product-actions">
            <button
              className="action-button-add-to-cart"
              onClick={handleaddtocart}
              disabled={addtocartloading}
            >
              {addtocartloading ? "loading..." : " Add to cart"}
            </button>
          </div>
        </div>
      </div>
      {showSuccessPopup && (
        <div className="success-popup">Successfully added to the cart!</div>
      )}
      {showUnSuccessPopup && (
        <div className="unsuccess-popup">Please select a quantity!</div>
      )}
    </div>
  );
}

export default FoodPurchasePanel;
