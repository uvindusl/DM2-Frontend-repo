import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import "../css/EmployeeViewOrders.css"; // Ensure this import is present
import EmployeeNavBar from "../components/EmployeeNavBar";

interface SubOder {
  id: number;
  customerId: number;
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

function EmployeeViewOrders() {
  const [subOrders, setSubOrders] = useState<SubOder[]>([]);
  const [foodDetails, setFoodDetails] = useState<Record<number, Food>>({});
  const [customerDetails, setCustomerDetails] = useState<
    Record<number, Customer>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supplierId = sessionStorage.getItem("supplierId");

  const handlecomplete = async (orderId: number, orderStatus: string) => {
    if (orderStatus === "Completed") {
      alert("Order already completed");
      return;
    } else {
      if (
        window.confirm("Are you sure you want to mark this order as complete?")
      ) {
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
        const customerIdsSet: Set<number> = new Set(
          subOrdersData.map((subOrder) => subOrder.customerId)
        );

        const foodDetailsTemp: Record<number, Food> = {};
        for (const foodId of foodIdsSet) {
          const { data: food } = await axios.get<Food>(
            `http://localhost:8080/urban-food/foods/${foodId}`
          );
          foodDetailsTemp[foodId] = food;
        }
        setFoodDetails(foodDetailsTemp);

        const customerDetailsTemp: Record<number, Customer> = {};
        for (const customerId of customerIdsSet) {
          const { data: customer } = await axios.get<Customer>(
            `http://localhost:8080/urban-food/customers/${customerId}`
          );
          customerDetailsTemp[customerId] = customer;
        }
        setCustomerDetails(customerDetailsTemp);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load sub-orders and related data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierSubOrders();
  }, [supplierId]);

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
              const firstSubOrder = subOrdersForOrder[0]; // To get customer info
              const customer = customerDetails[firstSubOrder?.customerId];

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
                                {" "}
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
                                      orderId,
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
