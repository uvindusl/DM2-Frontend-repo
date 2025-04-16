import axios from "axios";
import "../css/FoodPurchasePanel.css";
import { useEffect, useState } from "react";

interface Food {
  foodId: number;
  foodPic: string;
  foodName: string;
  foodPrice: number;
  foodDescription: string;
  foodCategory: string;
  foodSupId: number;
}

interface Supplier {
  id: number;
  name: string;
  address: string;
  tell: string;
  company: string;
}

interface FoodPurchasePanelProps {
  food: Food;
  supplier: Supplier; // You are passing a 'supplier' prop, but also fetching. Let's focus on the fetched one.
}

function FoodPurchasePanel({ food }: FoodPurchasePanelProps) {
  const [count, setCount] = useState(0);
  const [addtocartloading, setaddtocartloading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showUnSuccessPopup, setShowUnSuccessPopup] = useState(false);
  const [supplierData, setSupplierData] = useState<Supplier | null>(null); // State to hold a single supplier object
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const customerid = sessionStorage.getItem("customerId");
  console.log("Customer ID: ", customerid);

  useEffect(() => {
    const apiUrl = `http://localhost:8080/urban-food/suppliers/${food.foodSupId}`;

    setLoading(true);
    axios
      .get(apiUrl)
      .then((response) => {
        if (response.status === 200) {
          setSupplierData(response.data); // Assuming the API returns a single supplier object
        } else if (response.status === 404) {
          setSupplierData(null); // Supplier not found
        } else {
          setError(`Failed to load supplier data. Status: ${response.status}`);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching supplier data:", error);
        setError("Failed to load supplier data. Please try again later.");
        setLoading(false);
      });
  }, [food.foodSupId]);

  const handleaddtocart = async () => {
    if (count === 0) {
      setShowUnSuccessPopup(true);
      setTimeout(() => setShowUnSuccessPopup(false), 3000);
    } else {
      setaddtocartloading(true);
      try {
        const total = food.foodPrice * count;
        const response = await fetch(
          "http://localhost:8083/order-micro/carts",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customerId: customerid,
              foodId: food.foodId,
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

        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      } catch (error) {
        console.error("Error adding to cart:", error);
      } finally {
        setaddtocartloading(false);
      }
    }
  };

  const imageSource = food.foodPic
    ? `data:image/jpeg;base64,${food.foodPic}`
    : "/placeholder.png";

  return (
    <div>
      <div className="product-card">
        <div className="product-image">
          <img src={imageSource} alt={food.foodName} />
        </div>
        <div className="product-details">
          <div className="product-info">
            <div className="product-info-label">Name</div>
            <div className="product-info-value">{food.foodName}</div>

            <div className="product-info-label">Category</div>
            <div className="product-info-value">{food.foodCategory}</div>

            <div className="product-info-label">Description</div>
            <div className="product-info-value">{food.foodDescription}</div>

            <div className="product-info-label">Price</div>
            <div className="product-info-value">{food.foodPrice}</div>

            <div className="product-info-label">Supplier Name</div>
            <div className="product-info-value">
              {loading
                ? "Loading..."
                : error
                ? error
                : supplierData
                ? supplierData.name // Display the supplier's name
                : "N/A"}
            </div>

            <div className="product-info-label">Company</div>
            <div className="product-info-value">
              {loading
                ? "Loading..."
                : error
                ? error
                : supplierData
                ? supplierData.company // Display the supplier's name
                : "N/A"}
            </div>

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
          <br />
          <br />
          <br />
          <div className="product-review">
            <div className="product-info-label">
              <p className="product-review-p1">Write a review</p>
              <p className="product-review-p2">Your ideas matter</p>
            </div>
            <div className="text-input">
              <textarea className="text-area" />
            </div>
            <button className="action-button-review">Submit</button>
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
