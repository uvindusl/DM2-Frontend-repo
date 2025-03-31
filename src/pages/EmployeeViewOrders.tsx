import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import "../css/EmployeeViewOrders.css";
import EmployeeNavBar from "../components/EmployeeNavBar";

interface Order {
  orderId: number;
  orderCustomerId: number;
  orderTotalPrice: number;
  orderStatus: string;
}

interface SubOrderLog {
  foodId: number;
  foodQty: number;
}

interface Food {
  id: number;
  name: string;
  picture: string;
}

interface Customer {
  id: number;
  name: string;
  address: string;
}

function EmployeeViewOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [subOrdersMap, setSubOrdersMap] = useState<
    Record<number, SubOrderLog[]>
  >({});
  const [foodDetails, setFoodDetails] = useState<Record<number, Food>>({});
  const [customerDetails, setCustomerDetails] = useState<
    Record<number, Customer>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handlecomplete = async (orderId: number, orderStatus: string) => {
    if (orderStatus === "Completed") {
      alert("Order already completed");
      return;
    } else {
      window.confirm("Are you sure you want to mark this order as complete?");
      {
        try {
          await axios.patch(
            `http://localhost:8083/order-micro/orders/${orderId}`,
            {
              orderStatus: "Completed",
            }
          );
          window.location.reload();
        } catch (err) {
          console.error("Error marking order as complete:", err);
          alert("Failed to mark order as complete.");
        }
      }
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: ordersData } = await axios.get(
          "http://localhost:8083/order-micro/orders"
        );
        setOrders(ordersData);

        const subOrdersMapTemp: Record<number, SubOrderLog[]> = {};
        const foodIdsSet: Set<number> = new Set();
        const customerIdsSet: Set<number> = new Set();

        for (const order of ordersData) {
          const { data: subOrders } = await axios.get(
            `http://localhost:8083/order-micro/suborderlog/${order.orderId}`
          );
          subOrdersMapTemp[order.orderId] = subOrders;

          subOrders.forEach((sub: SubOrderLog) => {
            foodIdsSet.add(sub.foodId);
          });

          customerIdsSet.add(order.orderCustomerId);
        }

        setSubOrdersMap(subOrdersMapTemp);

        const foodDetailsTemp: Record<number, Food> = {};
        for (const foodId of foodIdsSet) {
          const { data: food } = await axios.get(
            `http://localhost:8081/food-micro/foods/${foodId}`
          );

          foodDetailsTemp[foodId] = {
            id: food.id,
            name: food.name,
            picture: food.picture,
          };
        }

        setFoodDetails(foodDetailsTemp);

        const customerDetailsTemp: Record<number, Customer> = {};
        for (const customerId of customerIdsSet) {
          const { data: customer } = await axios.get(
            `http://localhost:8080/customer-micro/customers/${customerId}`
          );
          console.log("Fetched customer:", customer);

          customerDetailsTemp[customerId] = {
            id: customer.customerId,
            name: customer.customerName,
            address: customer.customerAddress,
          };
        }

        console.log("Customer details before update:", customerDetailsTemp);
        setCustomerDetails(customerDetailsTemp);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load orders, suborders, or customer data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <EmployeeNavBar />
      <div className="orders-page">
        <h2 className="page-title">Customer Orders</h2>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <p>No orders found.</p>
            <p className="empty-subtitle">
              New orders will appear here when customers place them.
            </p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => {
              const customer = customerDetails[order.orderCustomerId];
              return (
                <div className="order-card" key={order.orderId}>
                  <h3>Order #{order.orderId}</h3>
                  <p>Total: Rs. {order.orderTotalPrice.toFixed(2)}</p>
                  <p>
                    Customer:{" "}
                    {customer
                      ? `${customer.name} (${customer.address})`
                      : "Loading..."}
                    <br />
                    Status: {order.orderStatus}
                  </p>
                  <div className="suborder-section">
                    <h4>Order Items</h4>
                    {subOrdersMap[order.orderId]?.map((subOrder, idx) => {
                      const food = foodDetails[subOrder.foodId];
                      return (
                        <div
                          className="suborder-item"
                          key={`${order.orderId}-${subOrder.foodId}-${idx}`}
                        >
                          {food ? (
                            <>
                              <img
                                src={`data:image/jpeg;base64,${food.picture}`}
                                alt={food.name}
                                className="food-img"
                              />
                              <p>{food.name}</p>
                              <p>Qty: {subOrder.foodQty}</p>
                            </>
                          ) : (
                            <p>Loading food details...</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <button
                    className="markComplete"
                    onClick={() =>
                      handlecomplete(order.orderId, order.orderStatus)
                    }
                  >
                    Mark as completed
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="footer7">
        <Footer />
      </div>
    </>
  );
}

export default EmployeeViewOrders;
