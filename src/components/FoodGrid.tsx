import "../css/FoodGrid.css";
import { useNavigate } from "react-router-dom";

interface Food {
  foodId: number;
  foodName: string;
  foodDescription: string;
  foodPic: string;
  foodPrice: number;
  foodCategory: string;
  foodSupplierId: number;
}

interface FoodGridProps {
  handleDeleteClick: (id: number) => void;
  food: Food;
}

function FoodGrid({ food, handleDeleteClick }: FoodGridProps) {
  const imageSource = food.foodPic
    ? `data:image/jpeg;base64,${food.foodPic}`
    : "/placeholder.png";

  const navigate = useNavigate();
  return (
    <div className="food-card">
      <div className="food-content">
        <div className="food-info">
          <h3 className="food-title">{food.foodName}</h3>
          <p className="food-description">{food.foodDescription}</p>
        </div>
        <div className="food-price">
          <p>Rs. {food.foodPrice?.toFixed(2) ?? "0.00"}</p>
        </div>
        <div className="food-image">
          <img
            src={imageSource}
            alt={food.foodName}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        </div>
        <div className="food-actions">
          <button
            className="food-edit-button"
            onClick={() => navigate(`/employee/update/food/${food.foodId}`)}
          >
            Edit
          </button>
          <button
            className="food-delete-button"
            onClick={() => handleDeleteClick(food.foodId)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodGrid;
