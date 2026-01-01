import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { ToastService } from '../services/toast-service';
import { NavigationExtras, Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);
  return next(req).pipe(
    // Add your error handling logic here
    catchError((error) => {
      if (error) {
        switch (error.status) {
          case 400: {
            if (error.error.errors) {
              const modelStateError = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modelStateError.push(error.error.errors[key]);
                }
              }
              throw modelStateError.flat();
            } else {
              toast.error(error.error);
            }
            break;
          }
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 401:
            toast.error(error.error?.message || 'Unauthorized access');
            break;
          case 500:
            const navigationExtras: NavigationExtras = { state: { error: error.error } };
            router.navigateByUrl('/server-error', navigationExtras);

            break;
          default:
            toast.error(error.error?.message || 'An unexpected error occurred');
            break;
        }
      }
      throw error;
    })
  );
};
