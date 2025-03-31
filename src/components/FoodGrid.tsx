import "../css/FoodGrid.css";
import { useNavigate } from "react-router-dom";

interface Food {
  id: number;
  name: string;
  description: string;
  picture: string;
  price: number;
}

interface FoodGridProps {
  handleDeleteClick: (id: number) => void;
  food: Food;
}

function FoodGrid({ food, handleDeleteClick }: FoodGridProps) {
  const imageSource = food.picture
    ? `data:image/jpeg;base64,${food.picture}`
    : "/placeholder.png";

  const navigate = useNavigate();
  return (
    <div className="food-card">
      <div className="food-content">
        <div className="food-info">
          <h3 className="food-title">{food.name}</h3>
          <p className="food-description">{food.description}</p>
        </div>
        <div className="food-price">
          <p>Rs. {food.price?.toFixed(2) ?? "0.00"}</p>
        </div>
        <div className="food-image">
          <img
            src={imageSource}
            alt={food.name}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        </div>
        <div className="food-actions">
          <button
            className="food-edit-button"
            onClick={() => navigate(`/employee/update/food/${food.id}`)}
          >
            Edit
          </button>
          <button
            className="food-delete-button"
            onClick={() => handleDeleteClick(food.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodGrid;
