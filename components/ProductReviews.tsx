"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiStar } from "react-icons/fi";
import ApiErrorMessage from "@/components/api/ApiErrorMessage";
import { useCreateReview, usePublicProductReviews } from "@/features/reviews/reviewQueries";
import { ProductReviewSummary } from "@/lib/models/product";
import { Review } from "@/lib/models/review";

type ProductReviewsProps = {
  productId: number;
  summary?: ProductReviewSummary;
};

const initialForm = {
  name: "",
  email: "",
  comment: "",
};

function RatingStars({
  value,
  onChange,
}: {
  value: number;
  onChange?: (value: number) => void;
}) {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isLit = star <= (hoveredRating || value);

        if (!onChange) {
          return (
            <FiStar
              key={star}
              className={`h-5 w-5 ${isLit ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          );
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform hover:scale-110"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <FiStar
              className={`h-8 w-8 transition-colors ${isLit ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          </button>
        );
      })}
    </div>
  );
}

function formatReviewDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <motion.article
      className="rounded-2xl border border-[#E5ECF8] bg-white p-5 shadow-[0_12px_30px_rgba(0,17,58,0.04)]"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="break-words text-lg font-extrabold text-[#00113A] [overflow-wrap:anywhere]">{review.name}</h4>
          {review.createdAt && (
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#5E6675]">
              {formatReviewDate(review.createdAt)}
            </p>
          )}
        </div>
        <RatingStars value={review.rate} />
      </div>
      <p className="mt-4 break-words leading-7 text-[#384152] [overflow-wrap:anywhere]">{review.comment}</p>
    </motion.article>
  );
}

export default function ProductReviews({ productId, summary }: ProductReviewsProps) {
  const createReviewMutation = useCreateReview();
  const reviewsQuery = usePublicProductReviews(productId, { pageNumber: 1, pageSize: 100 });
  const [rating, setRating] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const reviews = useMemo(() => reviewsQuery.data?.reviews ?? [], [reviewsQuery.data?.reviews]);
  const averageRate = Number(summary?.averageRate ?? 0);
  const totalReviews = reviews.length || Number(summary?.totalReviews ?? 0);

  const ratingRows = useMemo(() => {
    const counts = reviews.reduce<Record<number, number>>(
      (current, review) => {
        const normalizedRate = Math.max(1, Math.min(5, Math.round(review.rate || 0)));
        current[normalizedRate] += 1;
        return current;
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    );

    const roundedAverage = Math.round(averageRate);
    return [5, 4, 3, 2, 1].map((star) => {
      const count = counts[star] ?? 0;
      return {
        star,
        width: reviews.length ? (count / reviews.length) * 100 : totalReviews > 0 && star === roundedAverage ? 100 : 0,
      };
    });
  }, [averageRate, reviews, totalReviews]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError("");
    setSuccessMessage("");

    if (!rating) {
      setValidationError("Please choose a rating before submitting your review.");
      return;
    }

    if (!form.name.trim() || !form.email.trim() || !form.comment.trim()) {
      setValidationError("Please fill in your name, email, and review.");
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        productId,
        name: form.name.trim(),
        email: form.email.trim(),
        comment: form.comment.trim(),
        rate: rating,
      });

      setForm(initialForm);
      setRating(0);
      setSuccessMessage("Thank you. Your review was submitted successfully.");
    } catch {
      setSuccessMessage("");
    }
  };

  return (
    <section id="product-reviews" className="mt-16 w-full">
      <div className="rounded-[28px] border border-[#D9E4F5] bg-white p-4 shadow-[0_18px_50px_rgba(0,17,58,0.05)] md:p-6 lg:p-8">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0037AD]">Reviews for this product</p>
            <h3 className="mt-2 text-2xl font-extrabold text-[#00113A]">Customer Reviews</h3>
          </div>
          <p className="text-sm font-bold text-[#5E6675]">
            {totalReviews} review{totalReviews === 1 ? "" : "s"}
          </p>
        </div>

        {reviewsQuery.isLoading && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-32 animate-pulse rounded-2xl bg-[#F2F6FF]" />
            <div className="h-32 animate-pulse rounded-2xl bg-[#F2F6FF]" />
          </div>
        )}

        {reviewsQuery.isError && (
          <ApiErrorMessage error={reviewsQuery.error} title="Could not load product reviews" />
        )}

        {!reviewsQuery.isLoading && !reviewsQuery.isError && reviews.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {!reviewsQuery.isLoading && !reviewsQuery.isError && reviews.length === 0 && (
          <div className="rounded-2xl bg-[#F7FAFF] px-6 py-10 text-center">
            <h4 className="text-xl font-extrabold text-[#00113A]">No reviews for this product yet</h4>
            <p className="mt-2 text-sm font-semibold text-[#5E6675]">
              Be the first to share your experience.
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-8 rounded-[28px] border border-[#D9E4F5] bg-[#F7FAFF] p-4 md:p-6 lg:grid-cols-[0.85fr_1.15fr] lg:p-8">
        <motion.div
          className="rounded-[24px] bg-white p-6 shadow-[0_18px_50px_rgba(0,17,58,0.06)]"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0037AD]">Customer reviews</p>
          <div className="mt-5 flex items-end gap-3">
            <span className="text-6xl font-extrabold leading-none text-[#00113A] md:text-7xl">
              {averageRate.toFixed(1)}
            </span>
            <FiStar className="mb-2 h-10 w-10 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="mt-3 text-sm font-bold text-[#5E6675]">
            {totalReviews} review{totalReviews === 1 ? "" : "s"}
          </p>

          <div className="mt-8 space-y-3">
            {ratingRows.map((row) => (
              <div key={row.star} className="flex items-center gap-3">
                <span className="w-3 text-sm font-bold text-[#00113A]">{row.star}</span>
                <FiStar className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E5ECF8]">
                  <motion.div
                    className="h-full rounded-full bg-yellow-400"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${row.width}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="rounded-[24px] bg-white p-6 shadow-[0_18px_50px_rgba(0,17,58,0.06)]"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <h3 className="text-2xl font-extrabold text-[#00113A]">Add Review</h3>
          <p className="mt-2 text-sm leading-6 text-[#5E6675]">
            Share your experience with this product. Your email will not be shown publicly.
          </p>

          <div className="mt-6">
            <span className="mb-2 block text-sm font-bold text-[#00113A]">Rating</span>
            <RatingStars value={rating} onChange={setRating} />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#00113A]">Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="h-12 w-full rounded-xl border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#00113A]">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="h-12 w-full rounded-xl border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                placeholder="you@example.com"
              />
            </label>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-bold text-[#00113A]">Review</span>
            <textarea
              value={form.comment}
              onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
              className="min-h-[130px] w-full resize-y rounded-xl border border-[#D9E4F5] bg-[#F7FAFF] px-4 py-3 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
              placeholder="Tell us what you think..."
            />
          </label>

          {validationError && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
              {validationError}
            </p>
          )}

          {createReviewMutation.isError && (
            <div className="mt-4">
              <ApiErrorMessage error={createReviewMutation.error} title="Could not submit review" />
            </div>
          )}

          {successMessage && (
            <div className="mt-4 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900">
              <FiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" />
              <span>{successMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={createReviewMutation.isPending}
            className="mt-6 h-12 w-full rounded-full bg-[#0037AD] px-8 font-bold text-white transition-colors hover:bg-[#00267A] disabled:opacity-70 md:w-auto"
          >
            {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
          </button>
        </motion.form>
      </div>

    </section>
  );
}
