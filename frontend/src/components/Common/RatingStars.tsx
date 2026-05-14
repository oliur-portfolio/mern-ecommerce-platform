import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

interface RatingStarsProps {
  rating: number;
}

const RatingStars = ({ rating }: RatingStarsProps) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-px text-yellow-500">
        {[1, 2, 3, 4, 5].map((star) => {
          if (rating >= star) {
            return <FaStar key={star} className="w-4 h-4" />;
          }

          if (rating >= star - 0.5) {
            return <FaStarHalfAlt key={star} className="w-4 h-4" />;
          }

          return <FaRegStar key={star} className="w-4 h-4" />;
        })}
      </div>

      <span className="text-base font-medium text-gray-400 ml-1">
        {rating > 0 ? rating.toFixed(1) : "No reviews"}
      </span>
    </div>
  );
};

export default RatingStars;
