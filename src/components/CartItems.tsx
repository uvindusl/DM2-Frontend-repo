import React from "react";
import "./../css/Checkout.css"; // Import CSS if needed

interface CartItemProps {
  image: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

const CartItems: React.FC<CartItemProps> = ({ image, name, description, price, quantity }) => {
  return (
    <div className="cart-item">
      <img src={image} alt={name} className="item-image" />
      <div className="item-details">
        <h4>{name}</h4>
        <p>{description}</p>
        <p>Rs. {price}</p>
      </div>
      <div className="item-qty">QTY: {quantity}</div>
    </div>
  );
};

export default CartItems;
