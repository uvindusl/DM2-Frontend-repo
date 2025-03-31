import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/navBar";
import PaymentCard from "../components/PaymentCard";
import "../css/PaymentPage.css";

function PaymentPage() {
  const location = useLocation();
  const totalAmount = location.state?.totalAmount || 0; // Get totalAmount from navigation state

  return (
    <div>
      <NavBar />
      <div className="payment-page-container">
        <PaymentCard totalAmount={totalAmount} />
      </div>
      <div className="footer9">
        <Footer />
      </div>
    </div>
  );
}

export default PaymentPage;
