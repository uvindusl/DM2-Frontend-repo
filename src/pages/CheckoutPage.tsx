import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import "../css/Checkout.css";
import NavBar from "../components/navBar";
import Footer from "../components/Footer";

interface CartItemForCheckout {
  cartId: number;
  customerId: number;
  foodId: number;
  foodName: string;
  foodDescription: string;
  foodPic: string;
  foodPrice: number;
  qty: number;
  subTotal: number;
  supplierId?: number;
}

function CheckoutPage() {
  const customerId = sessionStorage.getItem("customerId");
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = location.state as { cartItems: CartItemForCheckout[] };

  useEffect(() => {
    console.log("Cart Items in CheckoutPage:", cartItems);
  }, [cartItems]);

  const totalAmount = cartItems.reduce(
    (sum: number, item: CartItemForCheckout) => sum + item.qty * item.foodPrice,
    0
  );

  const handlePayment = async () => {
    try {
      // 1. Save the order
      const orderRes = await axios.post(
        `http://localhost:8080/urban-food/orders`,
        {
          orderTotalPrice: totalAmount,
          orderCustomerId: customerId,
        }
      );
      const orderId = orderRes.data?.id;
      console.log("Generated Order ID:", orderId);

      if (orderId) {
        // 2. Save suborders
        for (const item of cartItems) {
          const suborderPayload = {
            customerId: customerId,
            foodId: item.foodId,
            qty: item.qty,
            orderId: orderId,
            supplierId: item.supplierId,
            status: "Pending",
          };
          console.log("Suborder Payload:", suborderPayload);
          await axios.post(
            `http://localhost:8080/urban-food/suborders`,
            suborderPayload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }

        // 3. Delete only the ordered cart items
        for (const item of cartItems) {
          await axios.delete(
            `http://localhost:8080/urban-food/carts?cartId=${item.cartId}`
          );
          console.log(`Deleted cart item with ID: ${item.cartId}`);
        }

        // 4. Redirect to payment
        navigate("/payment", { state: { totalAmount } });
      } else {
        alert("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Something went wrong during checkout.");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="checkout-page">
        <h2 className="checkout-h2">Checkout</h2>
        <div className="checkout-container1 ">
          <div className="checkout-details">
            <ul className="checkout-list1">
              {cartItems.map((item) => (
                <div className="food-card" key={item.foodId}>
                  <li className="food-item">
                    {item.foodPic && (
                      <img
                        src={`data:image/jpeg;base64,${item.foodPic}`}
                        alt={item.foodName}
                        className="food-img-checkout"
                      />
                    )}
                    <div className="food-info">
                      <div className="name"> {item.foodName}</div>
                      <div> Rs. {(item.foodPrice * item.qty).toFixed(2)}</div>
                    </div>
                  </li>
                  <div className="qty"> Qty: {item.qty}</div>
                </div>
              ))}
            </ul>
            <div className="total-card">
              <h3>Total: Rs. {totalAmount.toFixed(2)}</h3>
              <button className="proceed-btn" onClick={handlePayment}>
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer1">
        <Footer />
      </div>
    </div>
  );
}

export default CheckoutPage;
