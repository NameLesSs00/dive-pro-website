'use client';

import { FormEvent, useMemo, useState } from 'react';
import { FiEye, FiSearch, FiStar, FiTrash2, FiX } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import { useDeleteReview, useReviews } from '@/features/reviews/reviewQueries';
import { selectAccessToken } from '@/features/auth/authSelectors';
import { Review } from '@/lib/models/review';
import { useAppSelector } from '@/store/hooks';

const pageSize = 10;

function RatingStars({ rate }: { rate: number }) {
  const normalizedRate = Math.max(0, Math.min(5, Math.round(rate || 0)));

  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar key={star} className={`h-4 w-4 ${star <= normalizedRate ? 'fill-yellow-400' : 'text-gray-300'}`} />
      ))}
      <span className="ml-2 text-sm font-bold text-[#00113A]">{rate || 0}</span>
    </div>
  );
}

export default function AdminReviewsPage() {
  const token = useAppSelector(selectAccessToken);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const reviewsQuery = useReviews(token, { pageNumber, pageSize, search });
  const deleteMutation = useDeleteReview(token);
  const reviews = useMemo(() => reviewsQuery.data?.reviews ?? [], [reviewsQuery.data?.reviews]);
  const pagination = reviewsQuery.data?.pagination;
  const totalCount = Number(pagination?.totalCount ?? reviews.length);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPageNumber(1);
    setSearch(searchInput.trim());
  };

  const handleDelete = (reviewId: number) => {
    deleteMutation.mutate(reviewId, {
      onSuccess: () => {
        setConfirmDeleteId(null);
        setSelectedReview(null);
        setStatusMessage('Review deleted successfully.');
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#D9E4F5] bg-white p-6 shadow-[0_18px_50px_rgba(0,17,58,0.08)] md:p-8">
        <p className="text-sm font-bold uppercase text-[#0037AD]">Customer feedback</p>
        <h1 className="mt-2 text-3xl font-bold text-[#00113A] md:text-4xl">Reviews</h1>
        <p className="mt-3 max-w-2xl text-[#5E6675]">
          Review customer comments and remove anything that should not stay visible.
        </p>
      </div>

      <section className="rounded-lg border border-[#D9E4F5] bg-white p-4 shadow-[0_12px_34px_rgba(0,17,58,0.05)] md:p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <form className="flex w-full max-w-md gap-2" onSubmit={handleSearchSubmit}>
            <label className="relative block flex-1">
              <FiSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0037AD]" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] pl-11 pr-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                placeholder="Search reviews"
              />
            </label>
            <button type="submit" className="h-11 rounded-lg border border-[#D9E4F5] px-5 font-bold text-[#0037AD] hover:bg-[#EAF1FF]">
              Search
            </button>
          </form>
          <p className="text-sm font-semibold text-[#5E6675]">{totalCount} reviews</p>
        </div>

        {statusMessage && (
          <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900">
            {statusMessage}
          </div>
        )}

        {reviewsQuery.isError && <ApiErrorMessage error={reviewsQuery.error} title="Could not load reviews" />}
        {deleteMutation.isError && <ApiErrorMessage error={deleteMutation.error} title="Could not delete review" />}

        {reviewsQuery.isLoading ? (
          <div className="space-y-3">
            <div className="h-14 rounded-lg bg-[#F2F6FF]" />
            <div className="h-28 rounded-lg bg-[#F7FAFF]" />
            <div className="h-28 rounded-lg bg-[#F7FAFF]" />
          </div>
        ) : reviews.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] table-fixed border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-sm text-[#5E6675]">
                    <th className="w-[220px] rounded-l-lg bg-[#F7FAFF] px-4 py-3 font-bold">Reviewer</th>
                    <th className="w-[150px] bg-[#F7FAFF] px-4 py-3 font-bold">Product</th>
                    <th className="w-[170px] bg-[#F7FAFF] px-4 py-3 font-bold">Rating</th>
                    <th className="bg-[#F7FAFF] px-4 py-3 font-bold">Comment</th>
                    <th className="w-[160px] rounded-r-lg bg-[#F7FAFF] px-4 py-3 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id} className="group">
                      <td className="rounded-l-lg border-y border-l border-[#E5ECF8] bg-white px-4 py-3 group-hover:bg-[#FBFCFF]">
                        <p className="break-words font-bold text-[#00113A] [overflow-wrap:anywhere]">{review.name}</p>
                        <p className="mt-1 break-words text-sm text-[#5E6675] [overflow-wrap:anywhere]">{review.email}</p>
                      </td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-3 group-hover:bg-[#FBFCFF]">
                        <p className="font-bold text-[#00113A]">{review.productName || `Product #${review.productId}`}</p>
                      </td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-3 group-hover:bg-[#FBFCFF]">
                        <RatingStars rate={review.rate} />
                      </td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-3 group-hover:bg-[#FBFCFF]">
                        <p className="line-clamp-2 break-words text-sm leading-6 text-[#384152] [overflow-wrap:anywhere]">
                          {review.comment}
                        </p>
                      </td>
                      <td className="rounded-r-lg border-y border-r border-[#E5ECF8] bg-white px-4 py-3 text-right group-hover:bg-[#FBFCFF]">
                        {confirmDeleteId === review.id ? (
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setConfirmDeleteId(null)} className="rounded-lg border border-[#D9E4F5] px-4 py-2 text-sm font-bold text-[#384152]">
                              Cancel
                            </button>
                            <button type="button" onClick={() => handleDelete(review.id)} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white">
                              Delete
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setSelectedReview(review)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF1FF] text-[#0037AD]">
                              <FiEye className="h-5 w-5" />
                            </button>
                            <button type="button" onClick={() => setConfirmDeleteId(review.id)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#E5ECF8] pt-4">
              <p className="text-sm font-semibold text-[#5E6675]">
                Page {pageNumber} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button type="button" disabled={pageNumber <= 1} onClick={() => setPageNumber((current) => Math.max(1, current - 1))} className="h-10 rounded-lg border border-[#D9E4F5] px-4 text-sm font-bold text-[#0037AD] disabled:opacity-50">
                  Previous
                </button>
                <button type="button" disabled={pageNumber >= totalPages} onClick={() => setPageNumber((current) => Math.min(totalPages, current + 1))} className="h-10 rounded-lg border border-[#D9E4F5] px-4 text-sm font-bold text-[#0037AD] disabled:opacity-50">
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-lg bg-[#F7FAFF] px-6 py-12 text-center">
            <h2 className="text-xl font-bold text-[#00113A]">No reviews yet</h2>
            <p className="mt-2 text-[#5E6675]">Customer reviews will appear here when products receive feedback.</p>
          </div>
        )}
      </section>

      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00113A]/45 px-4 py-6">
          <div className="w-full max-w-2xl rounded-lg border border-[#D9E4F5] bg-white shadow-[0_24px_80px_rgba(0,17,58,0.18)]">
            <div className="flex items-center justify-between border-b border-[#E5ECF8] px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-[#00113A]">Review details</h2>
                <p className="mt-1 text-sm text-[#5E6675]">{selectedReview.productName || `Product #${selectedReview.productId}`}</p>
              </div>
              <button type="button" onClick={() => setSelectedReview(null)} className="flex h-9 w-9 items-center justify-center rounded-lg text-[#384152] hover:bg-[#F6F8FC]">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-5 p-5">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#5E6675]">Reviewer</p>
                <h3 className="mt-2 break-words text-2xl font-bold text-[#00113A] [overflow-wrap:anywhere]">{selectedReview.name}</h3>
                <p className="mt-1 break-words text-sm font-semibold text-[#0037AD] [overflow-wrap:anywhere]">{selectedReview.email}</p>
              </div>
              <RatingStars rate={selectedReview.rate} />
              <p className="break-words rounded-lg bg-[#F7FAFF] p-4 leading-7 text-[#384152] [overflow-wrap:anywhere]">
                {selectedReview.comment}
              </p>
              <div className="flex justify-end">
                <button type="button" onClick={() => handleDelete(selectedReview.id)} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 font-bold text-white">
                  <FiTrash2 className="h-4 w-4" />
                  Delete review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
