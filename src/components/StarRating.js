// StarRating.js
import React from "react";

const StarRating = ({ rating }) => {
    const filledStars = Math.floor(rating) || 0;
    const halfStar = rating - filledStars >= 0.5 ? 1 : 0;
    const emptyStars = 5 - filledStars - halfStar;

    return (
        <div className="flex items-center">
            {[...Array(filledStars)].map((_, index) => (
                <svg key={index} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                    <path d="M10 1l2.6 6.3 6.9.5-5 4.2 1.7 6.6-6.3-4.5-6.3 4.5 1.7-6.6-5-4.2 6.9-.5z" />
                </svg>
            ))}
            {halfStar === 1 && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                    <path d="M10 1l2.6 6.3 6.9.5-5 4.2 1.7 6.6-6.3-4.5-6.3 4.5 1.7-6.6-5-4.2 6.9-.5z" />
                </svg>
            )}
            {[...Array(emptyStars)].map((_, index) => (
                <svg key={index} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 1l2.6 6.3 6.9.5-5 4.2 1.7 6.6-6.3-4.5-6.3 4.5 1.7-6.6-5-4.2 6.9-.5z" />
                </svg>
            ))}
        </div>
    );
};

export default StarRating;
