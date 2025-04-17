import React from "react";
import "./../css/Checkout.css"; // Import CSS if needed

interface CartItemProps {
  foodPic: string;
  foodName: string;
  foodDescription: string;
  foodPrice: number;
  qty: number;
}

const CartItems: React.FC<CartItemProps> = ({
  foodPic,
  foodName,
  foodDescription,
  foodPrice,
  qty,
}) => {
  return (
    <div className="cart-item">
      <img src={foodPic} alt={foodName} className="item-image" />
      <div className="item-details">
        <h4>{foodName}</h4>
        <p>{foodDescription}</p>
        <p>Rs. {foodPrice}</p>
      </div>
      <div className="item-qty">QTY: {qty}</div>
    </div>
  );
};

export default CartItems;
