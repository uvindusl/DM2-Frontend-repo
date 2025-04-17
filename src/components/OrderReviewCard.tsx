import FoodReviewCard from "./FoodReviewCard";
import "../css/OrderReviewCard.css";

function OrderReviewCard() {
  return (
    <div className="order-review-card-container">
      <div className="order-review-card">
        <div className="detail">order id</div>
        <FoodReviewCard />
      </div>
    </div>
  );
}
export default OrderReviewCard;
