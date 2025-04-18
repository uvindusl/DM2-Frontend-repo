import "../css/FoodReviewView.css";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

interface Feedback {
  feedbackId: number;
  customerId: number;
  foodId: number;
  rating: number;
  feedback: string;
}

interface Customer {
  customerId: number;
  customerName: string;
  email: string;
  customerAddress: string;
  mobile: string;
}

interface FoodReviewViewProps {
  foodId: number;
}

function FoodReviewView({ foodId }: FoodReviewViewProps) {
  const [reviews, setReviews] = useState<Feedback[]>([]);
  const [customerData, setCustomerData] = useState<Record<number, Customer>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:8080/urban-food/feedbacks/${foodId}`
        );
        if (response.status === 200) {
          setReviews(response.data);
          response.data.forEach(async (review: Feedback) => {
            try {
              const customerResponse = await axios.get(
                `http://localhost:8080/urban-food/customers/${review.customerId}`
              );
              if (customerResponse.status === 200) {
                setCustomerData((prevData) => ({
                  ...prevData,
                  [review.customerId]: customerResponse.data,
                }));
              } else {
                console.warn(
                  `Failed to load customer data for ID ${review.customerId}. Status: ${customerResponse.status}`
                );
              }
            } catch (customerError: any) {
              console.error(
                `Error fetching customer data for ID ${review.customerId}:`,
                customerError
              );
            }
          });
        } else if (response.status === 404) {
          setReviews([]);
        } else {
          setError(`Failed to load reviews. Status: ${response.status}`);
        }
      } catch (error: any) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [foodId]);

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  if (error) {
    return <div>Error loading reviews: {error}</div>;
  }

  if (reviews.length === 0) {
    return <div>No reviews yet for this food item.</div>;
  }

  return (
    <div>
      {reviews.map((review) => {
        const customer = customerData[review.customerId];
        return (
          <div key={review.feedbackId} className="food-review-card1">
            <div className="food-review-card-header">
              <div className="food-review-card-content">
                <div>
                  <div className="details">
                    {customer
                      ? `Customer Name : ${customer.customerName}`
                      : "Customer Name Unavailable"}
                  </div>
                  <div className="details">
                    {`Customer Address : ${customer?.customerAddress} ` ||
                      "Address Unavailable"}
                  </div>
                </div>
              </div>
            </div>
            <div className="food-review-card-footer">
              <form className="food-review-form">
                <label className="review-lable"> Review</label>
                <p className="review-content">{review.feedback}</p>

                <label className="review-lable">Rating</label>
                <div className="rating-conatiner">
                  <div className="rating">
                    {[...Array(5)].map((_, index) => {
                      const starNumber = 5 - index;
                      return (
                        <React.Fragment key={starNumber}>
                          <input
                            type="radio"
                            id={`star${starNumber}-${review.feedbackId}`}
                            name={`rating-${review.feedbackId}`}
                            defaultValue={starNumber}
                            checked={review.rating === starNumber}
                            readOnly
                          />
                          <label
                            htmlFor={`star${starNumber}-${review.feedbackId}`}
                          />
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FoodReviewView;
