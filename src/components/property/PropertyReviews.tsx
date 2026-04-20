import React from 'react';
import { Quote } from 'lucide-react';
import { useReviews, type Review } from '@/hooks/useReviews';

interface PropertyReviewsProps {
  propertyId?: string;
  packageId?: string;
  title?: string;
}

export const PropertyReviews: React.FC<PropertyReviewsProps> = ({
  propertyId,
  packageId,
  title = 'Guest Reviews',
}) => {
  const { data: reviews = [] } = useReviews({ propertyId, packageId });

  if (!reviews.length) return null;

  return (
    <section className="mb-8 px-5 md:px-0">
      <h2 className="font-headline text-hc-primary text-2xl mb-4">{title}</h2>

      {/* Desktop grid - compact */}
      <div className="hidden md:grid grid-cols-2 gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-xl p-5 shadow-card flex flex-col"
          >
            <Quote size={20} className="text-hc-secondary/30 mb-2" />
            <blockquote className="font-headline text-hc-primary text-sm italic leading-relaxed mb-4 flex-1">
              "{review.quote}"
            </blockquote>
            <div>
              <div className="font-body font-bold text-hc-primary text-xs">
                {review.guest_name}
              </div>
              {review.guest_title && (
                <div className="font-body text-[10px] text-hc-text-light">
                  {review.guest_title}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile carousel - compact */}
      <div className="md:hidden -mr-5">
        <div
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3"
          style={{ scrollbarWidth: 'none' }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="min-w-[85vw] snap-start"
            >
              <div className="bg-white rounded-xl p-4 relative shadow-card">
                <Quote size={18} className="text-hc-secondary/30 mb-2" />
                <blockquote className="font-headline text-hc-primary text-sm italic leading-relaxed mb-3">
                  "{review.quote}"
                </blockquote>
                <div className="font-body font-bold text-hc-primary text-xs">
                  {review.guest_name}
                </div>
                {review.guest_title && (
                  <div className="font-body text-[10px] text-hc-text-light">
                    {review.guest_title}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
