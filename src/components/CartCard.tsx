import "../css/CartCard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Cart {
  foodid: string;
  foodname: string;
  fooddescription: string;
  foodimg: string;
  qty: number;
  subtotal: number;
  cartId: number;
  customerId: number;
}

interface CartCardProps {
  handleSingleDelete: (cartId: number) => void;
  cart: Cart;
}

function CartCard({ cart, handleSingleDelete }: CartCardProps) {
  const imageSource = cart.foodimg
    ? `data:image/jpeg;base64,${cart.foodimg}`
    : "/placeholder.png";
  const navigate = useNavigate();

  const handleSingleCheckout = async () => {
    try {
      await axios.post("http://localhost:8083/order-micro/suborders", {
        customerId: cart.customerId,
        foodId: Number(cart.foodid),
        quantity: cart.qty,
      });

      await axios.delete(
        `http://localhost:8083/order-micro/carts/byCartId/${cart.cartId}`
      );

      handleSingleDelete(cart.cartId);

      navigate("/checkout");
    } catch (error) {
      console.error("Single item checkout error", error);
      alert("Failed to checkout this item. Please try again.");
    }
  };

  return (
    <div className="cart-card">
      <div className="cart-content">
        <div className="cart-image">
          <img
            src={imageSource}
            alt={cart.foodname}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        </div>

        <div className="cart-info">
          <h3 className="cart-title">{cart.foodname}</h3>
          <p className="cart-description">{cart.fooddescription}</p>
          <div className="cart-meta">
            <p className="cart-qty">Qty {cart.qty}</p>
            <p>Price RS. {cart.subtotal?.toFixed(2) ?? "0.00"}</p>
          </div>
        </div>

        <div className="cart-actions">
          <button
            className="cart-delete-button"
            onClick={() => handleSingleDelete(cart.cartId)}
          >
            <img src="../src/assets/delete.svg" alt="Delete" />
          </button>
          <button className="checkout-btn" onClick={handleSingleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartCard;
