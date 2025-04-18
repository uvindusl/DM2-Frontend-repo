import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import "../css/FoodReviewCard.css";

interface SubOrder {
  id: number;
  customerId: number;
  foodId: number;
  qty: number;
  orderId: number;
  supplierId: number;
  status: string | null;
}

interface FoodDetails {
  foodId: number;
  foodName: string;
  foodDescription: string;
  foodPic?: string;
  foodPrice: number;
  foodCategory: string;
  foodSupId: number;
}

interface FoodReviewCardProps {
  subOrder: SubOrder;
  customerId: number;
}

const FoodReviewCard: React.FC<FoodReviewCardProps> = ({
  subOrder,
  customerId,
}) => {
  const [foodDetails, setFoodDetails] = useState<FoodDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const { foodId, qty, status } = subOrder; // Destructure status from subOrder

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/urban-food/foods/${foodId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: FoodDetails = await response.json();
        setFoodDetails(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [foodId]);

  const handleSubmitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setReviewError(null);

    try {
      const response = await fetch("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          foodId,
          reviewText,
          rating,
        }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      console.log("Review submitted successfully!");
      setReviewText("");
      setRating(0);
    } catch (e: any) {
      setReviewError(`Error submitting review: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading food details...</div>;
  if (error) return <div>Error fetching food details: {error}</div>;
  if (!foodDetails) return null;

  return (
    <div className="food-review-card">
      <div className="food-review-card-header">
        <div className="food-review-card-content">
          <div className="details">
            {foodDetails.foodPic && (
              <img
                src={`data:image/jpeg;base64,${foodDetails.foodPic}`}
                alt={foodDetails.foodName}
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
            )}
            {!foodDetails.foodPic && "No Image"}
          </div>
          <div>
            <div className="details">{foodDetails.foodName}</div>
            <div className="details">Price: {foodDetails.foodPrice}</div>
          </div>
        </div>
        <div className="details">Qty: {qty}</div>
      </div>

      <div className="food-review-card-body">
        {" "}
        <div className="details">
          Status: {status ? status : "Not Available"}{" "}
        </div>
      </div>

      <div className="food-review-card-footer">
        <form className="food-review-form" onSubmit={handleSubmitReview}>
          <div className="review-container">
            <label className="review-label">Review</label>
            <textarea
              placeholder="Share your thoughts on this food item"
              value={reviewText}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setReviewText(e.target.value)
              }
            />
          </div>

          <div>
            <label className="review-label">Rate this</label>
            <div className="rating-container">
              <div className="rating">
                {[5, 4, 3, 2, 1].map((value) => (
                  <React.Fragment key={value}>
                    <input
                      type="radio"
                      id={`star${value}-${subOrder.id}`}
                      name={`rating-${subOrder.id}`}
                      value={value}
                      checked={rating === value}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setRating(parseInt(e.target.value))
                      }
                    />
                    <label htmlFor={`star${value}-${subOrder.id}`}></label>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="review-submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
          {reviewError && <p className="error-message">{reviewError}</p>}
        </form>
      </div>
    </div>
  );
};

export default FoodReviewCard;
