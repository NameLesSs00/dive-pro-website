import { FiAlertTriangle } from 'react-icons/fi';
import { ApiError } from '@/lib/models/apiResponse';

type ApiErrorMessageProps = {
  error: unknown;
  title?: string;
};

function extractError(error: unknown) {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      errors: error.errors,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      errors: [error.message],
    };
  }

  return {
    message: 'Something went wrong.',
    errors: ['Something went wrong. Please try again.'],
  };
}

export default function ApiErrorMessage({ error, title = 'Something went wrong' }: ApiErrorMessageProps) {
  const parsedError = extractError(error);
  const uniqueErrors = Array.from(
    new Set((parsedError.errors.length ? parsedError.errors : [parsedError.message]).filter(Boolean))
  );

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-red-950">
      <div className="flex gap-3">
        <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700">
          <FiAlertTriangle className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-bold">{title}</p>
          {parsedError.message && <p className="mt-1 text-sm text-red-800">{parsedError.message}</p>}
          {uniqueErrors.length > 0 && (
            <ul className="mt-3 space-y-2 text-sm">
              {uniqueErrors.map((message) => (
                <li key={message} className="flex gap-2 leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                  <span>{message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
