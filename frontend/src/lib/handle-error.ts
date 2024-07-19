import { toast } from 'sonner';
import { z } from 'zod';

export function getErrorMessage(err: unknown) {
  const unknownError = 'Something went wrong, please try again later.';

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return errors.join('\n');
  } else if (err instanceof Error) {
    switch (err.response?.status) {
      case 401:
        return 'You are not authorized to perform this action';
      case 403:
        return 'You are not allowed to perform this action';
      case 404:
        return 'The requested resource was not found';
      case 409:
        return 'Conflict: The resource you are trying to delete is in use';
      case 500:
        return 'Internal Server Error';
    }
    return err.response.data.message;
  } else {
    return unknownError;
  }
}

export function showErrorToast(err: any) {
  const errorMessage = getErrorMessage(err);
  switch (err.response?.status) {
    case 401:
      return toast.error('You are not authorized to perform this action', {
        richColors: true,
        cancel: true,
        important: true,
      });
    case 403:
      return toast.error('You are not allowed to perform this action', {
        cancelButtonStyle: { color: 'red' },
        richColors: true,
        cancel: true,
        important: true,
      });
    case 404:
      return toast.error('The requested resource was not found', {
        richColors: true,
        cancel: true,
        important: true,
      });
    case 409:
      return toast.error('Conflict: The resource you are trying to delete is in use', {
        richColors: true,
        cancel: true,
        important: true,
      });
    case 500:
      return toast.error('Internal Server Error', {
        richColors: true,
        cancel: true,
        important: true,
      });
  }
  return toast.error(err.response.data.message ?? errorMessage, {
    richColors: true,
    cancel: true,
    important: true,
  });
}
