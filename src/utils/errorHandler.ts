import { CustomError } from '../types';

/**
 * Check if an object is a CustomError
 * @param obj Object to check
 * @returns True if the object is a CustomError
 */
export const isCustomError = (obj: any): obj is CustomError => {
  return obj && obj.error && typeof obj.error.code === 'string' && typeof obj.error.message === 'string';
};

/**
 * Get a user-friendly error message
 * @param error Error object
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (isCustomError(error)) {
    return error.error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
};

/**
 * Log an error to the console and optionally to an error tracking service
 * @param error Error object
 * @param context Additional context about where the error occurred
 */
export const logError = (error: unknown, context: string): void => {
  if (isCustomError(error)) {
    console.error(`Error in ${context}:`, error.error.code, error.error.message, error.error.details);
    // Here you could also log to Sentry or another error tracking service
    // Sentry.captureException(new Error(error.error.message), {
    //   extra: {
    //     code: error.error.code,
    //     details: error.error.details,
    //     context,
    //   },
    // });
  } else if (error instanceof Error) {
    console.error(`Error in ${context}:`, error);
    // Sentry.captureException(error, { extra: { context } });
  } else {
    console.error(`Unknown error in ${context}:`, error);
    // Sentry.captureMessage(`Unknown error in ${context}`, { extra: { error } });
  }
}; 