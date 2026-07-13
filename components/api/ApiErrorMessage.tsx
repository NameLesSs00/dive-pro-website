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
  const uniqueErrors = Array.from(new Set(parsedError.errors.length ? parsedError.errors : [parsedError.message]));

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-900">
      <p className="font-bold">{title}</p>
      {parsedError.message && <p className="mt-1 text-sm text-red-800">{parsedError.message}</p>}
      <ul className="mt-3 space-y-2 text-sm">
        {uniqueErrors.map((message) => (
          <li key={message} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
            <span>{message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
