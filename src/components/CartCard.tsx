// src/components/CartCard.tsx
import "../css/CartCard.css";
import { useNavigate } from "react-router-dom";

interface Cart {
  foodId: string;
  foodName: string;
  foodDescription: string;
  foodPic: string;
  qty: number;
  subtotal: number;
  id: number;
  customerId: number;
  supplierId?: number; // Assuming supplierId might come from the cart item
}

interface CartCardProps {
  handleSingleDelete: (cartId: number) => void;
  cart: Cart;
}

function CartCard({ cart, handleSingleDelete }: CartCardProps) {
  const imageSource = cart.foodPic
    ? `data:image/jpeg;base64,${cart.foodPic}`
    : "/placeholder.png";
  const navigate = useNavigate();

  const handleSingleCheckout = () => {
    const cartItem = {
      foodId: Number(cart.foodId),
      foodName: cart.foodName,
      foodDescription: cart.foodDescription,
      foodPic: cart.foodPic,
      foodPrice: cart.subtotal / cart.qty,
      qty: cart.qty,
      subTotal: cart.subtotal,
      customerId: cart.customerId,
      cartId: cart.id,
      supplierId: cart.supplierId, // Include supplierId here
    };
    navigate("/checkout", { state: { cartItems: [cartItem] } });
  };

  return (
    <div className="cart-card">
      <div className="cart-content">
        <div className="cart-image">
          <img
            src={imageSource}
            alt={cart.foodName}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        </div>

        <div className="cart-info">
          <h3 className="cart-title">{cart.foodName}</h3>
          <p className="cart-description">{cart.foodDescription}</p>
          <div className="cart-meta">
            <p className="cart-qty">Qty {cart.qty}</p>
            <p>Price Rs. {cart.subtotal.toFixed(2)}</p>
          </div>
        </div>

        <div className="cart-actions">
          <button
            className="cart-delete-button"
            onClick={() => handleSingleDelete(cart.id)}
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
