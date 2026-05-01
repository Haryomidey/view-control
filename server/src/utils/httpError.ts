export interface HttpError extends Error {
  statusCode: number;
  status?: number;
  code?: string;
}

export const httpError = (statusCode: number, message: string, code?: string) => {
  const error = new Error(message) as HttpError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
};
