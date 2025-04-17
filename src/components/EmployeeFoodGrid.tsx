import "../css/FoodGrid.css";

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

function EmployeeFoodGrid({ food }: FoodGridProps) {
  const imageSource = food.foodPic
    ? `data:image/jpeg;base64,${food.foodPic}`
    : "/placeholder.png";

  return (
    <div className="food-card">
      <div className="food-content">
        <div className="food-info">
          <h3 className="food-title">{food.foodName}</h3>
          <p className="food-description">{food.foodDescription}</p>
          <p className="food-category">{food.foodCategory}</p>
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
      </div>
    </div>
  );
}

export default EmployeeFoodGrid;
