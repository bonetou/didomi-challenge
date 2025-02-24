import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function GlobalApiResponses() {
  return applyDecorators(
    ApiResponse({
      status: 400,
      description: 'Bad Request - The request is invalid or malformed.',
      content: {
        'application/json': {
          example: {
            statusCode: 400,
            message: 'Unexpected input format',
            error: 'Bad Request',
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Not Found - The requested resource does not exist.',
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            message: 'Requested resource not found',
            error: 'Not Found',
          },
        },
      },
    }),
    ApiResponse({
      status: 422,
      description:
        'Unprocessable Entity - Validation failed for the request data.',
      content: {
        'application/json': {
          example: {
            statusCode: 422,
            message: ['Field X is required', 'Field Y must be a number'],
            error: 'Unprocessable Entity',
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error - An unexpected error occurred.',
      content: {
        'application/json': {
          example: {
            statusCode: 500,
            message: 'Internal server error occurred',
            error: 'Internal Server Error',
          },
        },
      },
    }),
  );
}
