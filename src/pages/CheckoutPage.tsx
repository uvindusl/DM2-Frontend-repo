import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navBar";
import Footer from "../components/Footer";
import "../css/Checkout.css";
import axios from "axios";

interface CheckoutItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  picture: string; // Base64 string for the image
}

function CheckoutPage() {
  const customerId = Number(sessionStorage.getItem("customerId"));
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!customerId) {
      setError("Invalid customer ID");
      setLoading(false);
      return;
    }

    const fetchCheckoutData = async () => {
      try {
        const subOrdersResponse = await axios.get(
          `http://localhost:8083/order-micro/suborders/${customerId}`
        );
        const subOrders = subOrdersResponse.data;

        if (subOrders.length === 0) {
          setCheckoutItems([]);
          setTotalAmount(0);
          setLoading(false);
          return;
        }

        const foodDetailsPromises = subOrders.map((order: { foodId: any }) =>
          axios.get(`http://localhost:8081/food-micro/foods/${order.foodId}`)
        );

        const foodResponses = await Promise.all(foodDetailsPromises);

        const checkoutData: CheckoutItem[] = subOrders
          .map((order: any, index: number) => {
            const foodResponse = foodResponses[index];
            if (foodResponse && foodResponse.data) {
              const food = foodResponse.data;
              return {
                id: order.foodId,
                name: food.name,
                price: food.price,
                quantity: order.quantity,
                picture: food.picture,
              };
            } else {
              console.warn(
                `Food details not found for foodId: ${order.foodId}`
              );
              return null;
            }
          })
          .filter(
            (item: CheckoutItem | null) => item !== null
          ) as CheckoutItem[];

        setCheckoutItems(checkoutData);

        const total = checkoutData.reduce(
          (sum: number, item: CheckoutItem) => sum + item.price * item.quantity,
          0
        );
        setTotalAmount(total);
      } catch (error: any) {
        console.error("Error fetching checkout data:", error);
        setError("Failed to load checkout details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [customerId]);

  const handlePayment = async () => {
    if (!customerId) {
      setError("Invalid customer ID");
      return;
    }

    if (checkoutItems.length === 0) {
      alert("No items to checkout.");
      return;
    }

    try {
      const orderTotalPrice = checkoutItems.reduce(
        (sum: number, item: CheckoutItem) => sum + item.price * item.quantity,
        0
      );

      const orderData = {
        orderTotalPrice: orderTotalPrice,
        orderCustomerId: customerId,
        orderStatus: "Pending",
      };

      const response = await axios.post(
        "http://localhost:8083/order-micro/orders",
        orderData
      );

      if (response.status === 200 || response.status === 201) {
        const orderId = response.data.orderId;

        for (const item of checkoutItems) {
          await axios.post("http://localhost:8083/order-micro/suborderlog", {
            orderId: orderId,
            foodId: item.id,
            foodQty: item.quantity,
            customerId: customerId,
          });
        }

        await axios.delete(
          `http://localhost:8083/order-micro/suborders/remove/${customerId}`
        );

        alert("Order placed Successfully.");

        setCheckoutItems([]);
        setTotalAmount(0);
        navigate("/Payment", { state: { totalAmount: orderTotalPrice } });
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setError("Payment failed. Please try again.");
      if (error.response?.data?.message) {
        setError(`Payment failed: ${error.response.data.message}`);
      }
    }
  };

  return (
    <div>
      <NavBar />
      <div className="container" style={{ marginTop: "2rem" }}>
        {loading ? (
          <p>Loading checkout details...</p>
        ) : error ? (
          <p>{error}</p>
        ) : checkoutItems.length > 0 ? (
          <div className="checkout-container1">
            <h2>Checkout Summary</h2>
            <ul className="checkout-items">
              {checkoutItems.map((item, index) => (
                <li key={`${item.id}-${index}`} className="checkout-item">
                  <img
                    src={
                      item.picture
                        ? `data:image/jpeg;base64,${item.picture}`
                        : "/placeholder.png"
                    }
                    alt={item.name}
                    className="checkout-item-img"
                  />
                  <div className="checkout-item-details">
                    <h4>{item.name}</h4>
                    <p>Price: Rs. {item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="checkout-total">
              <h3>Total: Rs. {totalAmount}</h3>
              <button className="proceed-btn" onClick={handlePayment}>
                Proceed to Payment
              </button>
            </div>
          </div>
        ) : (
          <p>No Orders</p>
        )}
      </div>
      <div className="footer1">
        <Footer />
      </div>
    </div>
  );
}

export default CheckoutPage;
