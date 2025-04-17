// src/pages/CartPage.tsx
import NavBar from "../components/navBar";
import Footer from "../components/Footer";
import "../css/CartPage.css";
import CartCard from "../components/CartCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface CartItem {
  id: number;
  customerId: number;
  foodId: number;
  qty: number;
  subTotal: number;
}

interface FoodItem {
  foodId: number;
  foodPic: string;
  foodName: string;
  foodDescription: string;
  foodPrice: number;
  foodSupId?: number; // Corrected property name to match backend
}

function CartPage() {
  const customerId = Number(sessionStorage.getItem("customerId"));
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [food, setFood] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/urban-food/carts/${customerId}`
        );
        const cartData = res.data;
        console.log("Fetched Cart Data:", cartData);
        cartData.forEach((item: CartItem) => console.log("Cart Item:", item));
        setCart(cartData);

        const foodDataPromises = cartData.map((item: CartItem) =>
          axios.get(`http://localhost:8080/urban-food/foods/${item.foodId}`)
        );
        const foodDataResponses = await Promise.all(foodDataPromises);
        const foodData = foodDataResponses.map((r) => r.data);
        setFood(foodData);
      } catch (err) {
        console.error("Failed to load cart", err);
        setCart([]);
        setFood([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [customerId]);

  const handleCheckout = () => {
    const cartWithFoodPromises = cart.map(async (item) => {
      const foodItemResponse = await axios.get(
        `http://localhost:8080/urban-food/foods/${item.foodId}`
      );
      const foodItem = foodItemResponse.data;
      console.log("Fetched Food Item Response Data:", foodItem);
      console.log("Fetched Food Item for Checkout:", foodItem);
      return {
        ...item,
        foodName: foodItem?.foodName || "",
        foodDescription: foodItem?.foodDescription || "",
        foodPic: foodItem?.foodPic || "",
        foodPrice: foodItem?.foodPrice || 0,
        supplierId: foodItem?.foodSupId, // Corrected property name
      };
    });

    Promise.all(cartWithFoodPromises).then((resolvedCartWithFood) => {
      console.log("Cart Items before checkout:", resolvedCartWithFood);
      navigate("/checkout", { state: { cartItems: resolvedCartWithFood } });
    });
  };

  const handleSingleDelete = async (cartId: number) => {
    console.log(`http://localhost:8080/urban-food/carts?cartId=${cartId}`);
    await axios.delete(
      `http://localhost:8080/urban-food/carts?cartId=${cartId}`
    );
    setCart(cart.filter((item) => item.id !== cartId));
  };

  return (
    <div className="cart-container">
      <NavBar />
      <div className="cart-main-content">
        {loading ? (
          <p>Loading...</p>
        ) : cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-cards-container">
              {cart.map((item) => {
                const foodItem = food.find((f) => f.foodId === item.foodId);
                if (!foodItem) return null;

                return (
                  <CartCard
                    key={item.id}
                    cart={{
                      foodId: item.foodId.toString(),
                      foodName: foodItem.foodName,
                      foodDescription: foodItem.foodDescription,
                      foodPic: foodItem.foodPic,
                      qty: item.qty,
                      subtotal: item.subTotal,
                      id: item.id,
                      customerId: item.customerId,
                      supplierId: foodItem.foodSupId, // Corrected property name
                    }}
                    handleSingleDelete={handleSingleDelete}
                  />
                );
              })}
            </div>
            <div className="order-summary-section">
              <h2>Order Summary</h2>
              <p>Total Items: {cart.length}</p>
              <p>
                Subtotal: Rs.{" "}
                {cart.reduce((sum, item) => sum + item.subTotal, 0).toFixed(2)}
              </p>
              <button className="checkout-btn" onClick={handleCheckout}>
                Checkout All
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default CartPage;
