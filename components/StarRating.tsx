"use client";

export default function StarRating({ rating } : { rating: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => {
        const fill = i < rating ? "fill-yellow-500" : "fill-gray-300";
        return (
          <svg key={i} className={`w-4 h-4 ${fill}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 0a1 1 0 0 1 .77.36l2.56 3.2 4.6 1.33a1 1 0 0 1 .55 1.7l-3.5 3.4 1 4.8a1 1 0 0 1-1.45 1.05L10 14.4l-4.6 2.4a1 1 0 0 1-1.45-1.05l1-4.8-3.5-3.4a1 1 0 0 1 .55-1.7l4.6-1.33 2.56-3.2A1 1 0 0 1 10 0z"/>
          </svg>
        );
      })}
    </div>
  );
}