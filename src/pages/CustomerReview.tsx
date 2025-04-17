import Footer from "../components/Footer";
import NavBar from "../components/navBar";
import OrderReviewCard from "../components/OrderReviewCard";

function CustomerReview() {
  return (
    <div className="customer-review-page">
      <NavBar />
      <OrderReviewCard />
      <Footer />
    </div>
  );
}

export default CustomerReview;
