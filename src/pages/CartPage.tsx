import NavBar from "../components/navBar";
import Footer from "../components/Footer";
import "../css/CartPage.css";
import CartCard from "../components/CartCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface CartItem {
  cartId: number;
  customerId: number;
  foodId: number;
  qty: number;
  subTotal: number;
}

interface FoodItem {
  foodId: number; // Changed 'id' to 'foodId'
  foodPic: string;
  foodName: string;
  foodDescription: string;
  foodPrice: number;
  foodCategory: string;
  foodSupId: number;
}

function CartPage() {
  const navigate = useNavigate();
  const customerid = Number(sessionStorage.getItem("customerId"));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [food, setFood] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerid) {
      setError("Invalid customer ID");
      setLoading(false);
      return;
    }

    const fetchCartData = async () => {
      try {
        const cartResponse = await axios.get(
          `http://localhost:8080/urban-food/carts/${customerid}`
        );

        console.log("Cart API Response:", cartResponse);

        if (cartResponse.status === 200) {
          setCart(cartResponse.data);
          console.log("Cart Data:", cartResponse.data);
          fetchFoodDetails(cartResponse.data);
        } else if (cartResponse.status === 204) {
          setCart([]);
          setFood([]);
        } else {
          setError("Failed to fetch cart data. Please try again later.");
        }
      } catch (error: any) {
        console.error("Error fetching cart data:", error);
        if (error.response && error.response.status === 404) {
          setCart([]);
          setFood([]);
        } else {
          setError("Failed to fetch cart data. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchFoodDetails = async (cartItems: CartItem[]) => {
      try {
        console.log("Fetching food details for cart items:", cartItems);
        const foodPromises = cartItems.map((item) =>
          axios
            .get(`http://localhost:8080/urban-food/foods/${item.foodId}`)
            .then((res) => {
              console.log(`Food API Response for foodId ${item.foodId}:`, res);
              return res.data;
            })
            .catch((err) => {
              console.error(
                `Error fetching food details for foodId ${item.foodId}:`,
                err
              );
              return null;
            })
        );

        const foodDetails = (await Promise.all(foodPromises)).filter(
          (item) => item !== null && item !== undefined
        ) as FoodItem[];
        console.log("Fetched Food Details:", foodDetails);
        console.log("Food Details Before Set:", foodDetails); // Added log
        setFood(foodDetails);
        console.log("Food State Updated:", food);
      } catch (error) {
        console.error("Error fetching food details:", error);
      }
    };

    fetchCartData();
  }, [customerid]);

  const DeleteAll = async (customerId: number) => {
    try {
      const apiUrl = `http://localhost:8080/urban-food/carts?customerId=${customerId}`;
      await axios.delete(apiUrl);
      window.location.reload();
    } catch (error) {
      console.error("Error", error);
      setError("Failed to delete");
    }
  };

  const handleCheckout = async () => {
    if (!customerid) {
      setError("Invalid customer ID. Please log in again.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      const checkoutRequests = cart.map(async (item) => {
        const orderData = {
          customerId: customerid,
          foodId: item.foodId,
          qty: item.qty,
        };

        return axios.post(
          "http://localhost:8080/urban-food/suborders",
          orderData
        );
      });

      await Promise.all(checkoutRequests);

      await axios.delete(
        `http://localhost:8083/order-micro/carts/byCustomerId/${customerid}`
      );

      setCart([]);

      navigate("/checkout");
    } catch (error: any) {
      console.error("Checkout error:", error);
      setError("Failed to process checkout. Please try again.");
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(`Checkout failed: ${error.response.data.message}`);
      }
    }
  };

  return (
    <div className="cart-container">
      <NavBar />
      <div className="cart-main-content">
        <div className="cart-items-section">
          {loading ? (
            <p>Loading cart items...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="cart-cards-container">
              <div className="cart-controls">
                <div className="delete-all">
                  <button
                    className="delete-btn"
                    onClick={() => DeleteAll(customerid)}
                  >
                    <i className="trash-icon"></i> Delete All
                  </button>
                </div>
              </div>
              {cart.map((cartItem, index) => {
                const foodItem = food.find(
                  (f) => Number(f.foodId) === Number(cartItem.foodId)
                );

                console.log(
                  "Cart Item:",
                  cartItem,
                  "Found Food Item:",
                  foodItem
                );

                if (!foodItem) {
                  return (
                    <div
                      key={`missing-${cartItem.cartId ?? `i${index}`}`}
                      className="cart-card"
                    >
                      <p>
                        Food details not available for food ID {cartItem.foodId}
                      </p>
                    </div>
                  );
                }

                return (
                  <CartCard
                    key={cartItem.cartId ?? `cart-i${index}`}
                    cart={{
                      foodId: cartItem.foodId.toString(),
                      foodName: foodItem.foodName,
                      foodDescription: foodItem.foodDescription,
                      foodPic: foodItem.foodPic,
                      qty: cartItem.qty,
                      subtotal: cartItem.subTotal ?? 0,
                      cartId: cartItem.cartId,
                      customerId: cartItem.customerId,
                    }}
                    handleSingleDelete={(cartId) => {
                      setCart(cart.filter((item) => item.cartId !== cartId));
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="order-summary-section">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Items:</span>
              <span className="summary-value">{cart.length}</span>
            </div>
            <div className="summary-row sub-total">
              <span>Sub Total:</span>
              <span className="summary-value">
                RS.
                {cart
                  .reduce((sum, item) => sum + (item.subTotal ?? 0), 0)
                  .toFixed(2)}
              </span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout All
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default CartPage;
