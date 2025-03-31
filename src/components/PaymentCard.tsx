import "../css/PaymentCard.css";
import visaLogo from "../assets/363_Visa_Credit_Card_logo-512.webp";
import mastercardLogo from "../assets/R.png";
import paypalLogo from "../assets/paypal-logo-transparent-free-png.webp";
import cashLogo from "../assets/Cash.jpg";

interface PaymentCardProps {
  totalAmount: number;
}

function PaymentCard({ totalAmount }: PaymentCardProps) {
  return (
    <div>
      <div className="card">
        <div className="header">
          <h1 className="title1">Proceed Payment</h1>
        </div>
        <div className="pic-grid">
          <div className="sub-card visa">
            <img className="img-container visa" src={visaLogo} alt="visa" />
          </div>
          <div className="sub-card mastercard">
            <img
              className="img-container mastercard"
              src={mastercardLogo}
              alt="mastercard"
            />
          </div>
          <div className="sub-card paypal">
            <img
              className="img-container paypal"
              src={paypalLogo}
              alt="paypal"
            />
          </div>
          <div className="sub-card">
            <img
              className="img-container cash"
              src={cashLogo}
              alt="cash on delivery"
            />
          </div>
        </div>
        <div className="price">
          <h1 className="title2">Total: Rs. {totalAmount}</h1>
        </div>
        <div className="text">
          <p>*Card payments may charge additional bank charges.</p>
          <p>*Cash on delivery available</p>
        </div>
      </div>
    </div>
  );
}

export default PaymentCard;
