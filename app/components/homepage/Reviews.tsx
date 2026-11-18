import SectionHeading from "./SectionHeading";

// Sample customer reviews
const reviews = [
  {
    name: "Amira Khan",
    meta: "Ordered 14 times",
    stars: 5,
    text: "Found a wood-fired place two streets away that I never knew existed. The pizza arrived hot, the box wasn’t soggy, and tracking was spot on.",
  },
  {
    name: "Daniel Ortiz",
    meta: "Weekly regular",
    stars: 5,
    text: "Checkout takes seconds and the delivery fees are always clear up front. Friday pizza night has never been this easy.",
  },
  {
    name: "Priya Nair",
    meta: "Family of four",
    stars: 4,
    text: "Great variety of shops and the veggie filter saves me every time. One late delivery, but support fixed it within minutes.",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeading
          center
          eyebrow="Loved by pizza fans"
          title="Don't just take our word for it"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <figure
              key={review.name}
              className="rounded-3xl border border-border bg-white p-6"
            >
              {/* "★★★★☆" - filled stars first, then empty ones */}
              <div
                role="img"
                aria-label={`${review.stars} out of 5 stars`}
                className="text-xl text-accent"
              >
                {"★".repeat(review.stars)}
                {"☆".repeat(5 - review.stars)}
              </div>
              <blockquote className="mt-3 text-muted">“{review.text}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                {/* Avatar with the first letter of the name */}
                <span className="grid size-10 place-items-center rounded-full bg-secondary-100 font-bold text-secondary-600">
                  {review.name[0]}
                </span>
                <span>
                  <strong className="block leading-tight">{review.name}</strong>
                  <span className="text-sm text-muted">{review.meta}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
