import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import "../css/EmployeeViewOrders.css"; // Ensure this import is present
import EmployeeNavBar from "../components/EmployeeNavBar";

interface SubOder {
  id: number;
  foodId: number;
  qty: number;
  orderId: number;
  supplierId: number;
  status: string | null;
}

interface Food {
  foodId: number;
  foodName: string;
  foodPic: string;
  foodPrice: number;
}

interface Customer {
  customerId: number;
  customerName: string;
  customerAddress: string;
}

interface Order {
  orderId: number;
  orderCustomerId: number;
  orderTotalPrice: number;
}

function EmployeeViewOrders() {
  const [subOrders, setSubOrders] = useState<SubOder[]>([]);
  const [foodDetails, setFoodDetails] = useState<Record<number, Food>>({});
  const [customerDetails, setCustomerDetails] = useState<
    Record<number, Customer>
  >({});
  const [orderDetails, setOrderDetails] = useState<Record<number, Order>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supplierId = sessionStorage.getItem("supplierId");

  const handlecomplete = async (id: number, orderStatus: string) => {
    if (orderStatus === "Completed") {
      alert("Order already completed");
      return;
    } else {
      if (
        window.confirm("Are you sure you want to mark this order as complete?")
      ) {
        try {
          await axios.patch(
            `http://localhost:8080/urban-food/suborders/${id}`,
            {
              status: "Completed",
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
    const fetchSupplierSubOrders = async () => {
      if (!supplierId) {
        setError("Supplier ID not found.");
        setLoading(false);
        return;
      }

      try {
        const { data: subOrdersData } = await axios.get<SubOder[]>(
          `http://localhost:8080/urban-food/suborders/supplier/${supplierId}`
        );
        setSubOrders(subOrdersData);

        const foodIdsSet: Set<number> = new Set(
          subOrdersData.map((subOrder) => subOrder.foodId)
        );
        const orderIdsSet: Set<number> = new Set(
          subOrdersData.map((subOrder) => subOrder.orderId)
        );

        const foodDetailsTemp: Record<number, Food> = {};
        for (const foodId of foodIdsSet) {
          const { data: food } = await axios.get<Food>(
            `http://localhost:8080/urban-food/foods/${foodId}`
          );
          foodDetailsTemp[foodId] = food;
        }
        setFoodDetails(foodDetailsTemp);

        const orderDetailsTemp: Record<number, Order> = {};
        for (const orderId of orderIdsSet) {
          const { data: order } = await axios.get<Order>(
            `http://localhost:8080/urban-food/orders/${orderId}`
          );
          orderDetailsTemp[orderId] = order;
        }
        setOrderDetails(orderDetailsTemp);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load sub-orders and related data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierSubOrders();
  }, [supplierId]);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      const customerDetailsTemp: Record<number, Customer> = {};
      const customerIdsSet: Set<number> = new Set(
        Object.values(orderDetails).map((order) => order.orderCustomerId)
      );

      for (const customerId of customerIdsSet) {
        try {
          const { data: customer } = await axios.get<Customer>(
            `http://localhost:8080/urban-food/customers/${customerId}`
          );
          customerDetailsTemp[customerId] = customer;
        } catch (error) {
          console.error(`Error fetching customer ${customerId}:`, error);
          // Optionally handle the error for a specific customer
        }
      }
      setCustomerDetails(customerDetailsTemp);
    };

    if (!loading && Object.keys(orderDetails).length > 0) {
      fetchCustomerDetails();
    }
  }, [orderDetails, loading]);

  // Group sub-orders by orderId
  const groupedSubOrders: Record<number, SubOder[]> = subOrders.reduce(
    (acc, subOrder) => {
      acc[subOrder.orderId] = acc[subOrder.orderId] || [];
      acc[subOrder.orderId].push(subOrder);
      return acc;
    },
    {} as Record<number, SubOder[]>
  );

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
        ) : subOrders.length === 0 ? (
          <div className="empty-state">
            <p>No orders found for this supplier.</p>
            <p className="empty-subtitle">
              New orders will appear here when customers place them.
            </p>
          </div>
        ) : (
          <div className="orders-grid">
            {Object.keys(groupedSubOrders).map((orderIdStr) => {
              const orderId = parseInt(orderIdStr);
              const subOrdersForOrder = groupedSubOrders[orderId];
              const orderInfo = orderDetails[orderId];
              const customer = customerDetails[orderInfo?.orderCustomerId];

              // Calculate total price for the order
              const orderTotalPrice = subOrdersForOrder.reduce(
                (sum, subOrder) => {
                  const food = foodDetails[subOrder.foodId];
                  return food ? sum + subOrder.qty * food.foodPrice : sum;
                },
                0
              );

              return (
                <div className="order-card" key={orderId}>
                  <h3>Order #{orderId}</h3>
                  <p>Total: Rs. {orderTotalPrice.toFixed(2)}</p>
                  <p>
                    Customer:{" "}
                    {customer
                      ? `${customer.customerName} (${customer.customerAddress})`
                      : "Loading..."}
                  </p>
                  <div className="suborder-section">
                    <h4>Order Items</h4>
                    {subOrdersForOrder?.map((subOrder) => {
                      const food = foodDetails[subOrder.foodId];
                      return (
                        <div
                          className="suborder-item"
                          key={`${orderId}-${subOrder.foodId}`}
                        >
                          {food ? (
                            <>
                              <div>
                                <img
                                  src={`data:image/jpeg;base64,${food.foodPic}`}
                                  alt={food.foodName}
                                  className="food-img"
                                />
                                <p className="food-name">{food.foodName}</p>
                                <p className="food-qty">Qty: {subOrder.qty}</p>
                                <p className="food-price1">
                                  Price: Rs. {food.foodPrice.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="food-subtotal">
                                  Subtotal: Rs.{" "}
                                  {(subOrder.qty * food.foodPrice).toFixed(2)}
                                </p>
                                <p className="food-status">
                                  Status: {subOrder.status}
                                </p>
                                <button
                                  className="markComplete"
                                  onClick={() =>
                                    handlecomplete(
                                      subOrder.id,
                                      subOrder.status || ""
                                    )
                                  }
                                  disabled={subOrder.status === "Completed"}
                                >
                                  {subOrder.status === "Completed"
                                    ? "Completed"
                                    : "Mark as completed"}
                                </button>
                              </div>
                            </>
                          ) : (
                            <p>Loading food details...</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
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
