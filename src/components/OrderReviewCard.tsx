import React, { useState, useEffect } from "react";
import FoodReviewCard from "./FoodReviewCard";
import "../css/OrderReviewCard.css";

interface Order {
  id: number;
  orderTotalPrice: number;
  orderCustomerId: number;
}

interface SubOrder {
  id: number;
  customerId: number;
  foodId: number;
  qty: number;
  orderId: number;
  supplierId: number;
  status: string | null;
}

interface SubOrderListProps {
  orderId: number;
  customerId: number;
}

const SubOrderList: React.FC<SubOrderListProps> = ({ orderId, customerId }) => {
  const [subOrders, setSubOrders] = useState<SubOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/urban-food/suborders/${orderId}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data: SubOrder[] = await response.json();
        setSubOrders(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubOrders();
  }, [orderId]);

  if (loading) return <div>Loading order items...</div>;
  if (error) return <div>Error fetching order items: {error}</div>;

  return (
    <div>
      {subOrders.map((subOrder) => (
        <FoodReviewCard
          key={subOrder.id}
          subOrder={subOrder}
          customerId={customerId}
        />
      ))}
    </div>
  );
};

interface OrderReviewCardProps {}

const OrderReviewCard: React.FC<OrderReviewCardProps> = () => {
  const customerId = sessionStorage.getItem("customerId");
  const numericCustomerId = customerId ? Number(customerId) : null;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!numericCustomerId) {
          setError("Customer ID not found in session storage.");
          setLoading(false);
          return;
        }
        const response = await fetch(
          `http://localhost:8080/urban-food/orders/customer/${numericCustomerId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [numericCustomerId]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error fetching orders: {error}</div>;

  return (
    <div className="order-review-card-container">
      {orders.map((order) => (
        <div key={order.id} className="order-review-card">
          <div className="detail">Order ID: {order.id}</div>
          {numericCustomerId !== null && (
            <SubOrderList orderId={order.id} customerId={numericCustomerId} />
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderReviewCard;
