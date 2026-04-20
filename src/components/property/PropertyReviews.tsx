import React from 'react';
import { Quote } from 'lucide-react';
import { useReviews, type Review } from '@/hooks/useReviews';

interface PropertyReviewsProps {
  propertyId?: string;
  packageId?: string;
  title?: string;
}

const getInitials = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const Avatar: React.FC<{ review: Review }> = ({ review }) => (
  <div className="w-12 h-12 rounded-full bg-hc-secondary/20 flex items-center justify-center shrink-0">
    <span className="font-body font-bold text-hc-primary text-sm">
      {review.initials ?? getInitials(review.guest_name)}
    </span>
  </div>
);

export const PropertyReviews: React.FC<PropertyReviewsProps> = ({
  propertyId,
  packageId,
  title = 'Guest Reviews',
}) => {
  const { data: reviews = [] } = useReviews({ propertyId, packageId });

  if (!reviews.length) return null;

  return (
    <section className="mb-12 px-5 md:px-0">
      <h2 className="font-headline text-hc-primary text-3xl mb-6">{title}</h2>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl p-8 shadow-card flex flex-col"
          >
            <Quote size={28} className="text-hc-secondary/30 mb-3" />
            <blockquote className="font-headline text-hc-primary text-lg italic leading-relaxed mb-6 flex-1">
              "{review.quote}"
            </blockquote>
            <div className="flex items-center gap-4">
              <Avatar review={review} />
              <div>
                <div className="font-body font-bold text-hc-primary text-sm">
                  {review.guest_name}
                </div>
                {review.guest_title && (
                  <div className="font-body text-xs text-hc-text-light">
                    {review.guest_title}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile carousel */}
      <div className="md:hidden -mr-5">
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="min-w-[85vw] snap-start"
            >
              <div className="bg-white rounded-2xl p-6 relative shadow-card">
                <div className="absolute -top-4 right-4">
                  <Avatar review={review} />
                </div>
                <Quote size={24} className="text-hc-secondary/30 mb-3" />
                <blockquote className="font-headline text-hc-primary text-base italic leading-relaxed mb-4">
                  "{review.quote}"
                </blockquote>
                <div className="font-body font-bold text-hc-primary text-sm">
                  {review.guest_name}
                </div>
                {review.guest_title && (
                  <div className="font-body text-xs text-hc-text-light">
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
