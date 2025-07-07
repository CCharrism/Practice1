import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout, tap } from 'rxjs/operators';

@Injectable()
export class GlobalErrorInterceptor implements HttpInterceptor {
  // You can set a global timeout for all requests here (e.g. 30 seconds)
  private readonly REQUEST_TIMEOUT = 30000; 

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      timeout(this.REQUEST_TIMEOUT),

      // Optional: tap for logging successful responses
      tap(event => {
        if (event instanceof HttpResponse) {
          // Successful response logging (optional)
          console.log(`HTTP ${req.method} to ${req.url} succeeded with status ${event.status}`);
        }
      }),

      catchError(err => this.handleError(err, req))
    );
  }

  private handleError(error: any, req: HttpRequest<any>): Observable<never> {
    let errorMessage = '';

    if (error instanceof TimeoutError) {
      errorMessage = `Request timed out after ${this.REQUEST_TIMEOUT / 1000} seconds for ${req.url}`;
    } else if (error instanceof HttpErrorResponse) {
      // Server or connection error happened
      if (!navigator.onLine) {
        // No Internet connection
        errorMessage = 'No Internet Connection';
      } else {
        // HTTP error status code
        errorMessage = this.getServerErrorMessage(error);
      }
    } else if (error.name === 'CanceledError') {
      // Angular 15+ uses this for cancelled requests (like unsubscribed)
      errorMessage = `Request cancelled: ${req.url}`;
    } else if (error instanceof Error) {
      // Client-side or network error
      errorMessage = `Client Error: ${error.message}`;
    } else {
      // Unknown error
      errorMessage = 'An unknown error occurred';
    }

    // Log the error to the console or send to a remote logging infrastructure
    console.error('HTTP Error:', {
      url: req.url,
      method: req.method,
      message: errorMessage,
      originalError: error
    });

    // Here you could customize how errors propagate (throwError) or show UI messages

    return throwError(() => new Error(errorMessage));
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400:
        return `Bad Request: ${this.extractErrorMessage(error)}`;
      case 401:
        return `Unauthorized: Please log in again.`;
      case 403:
        return `Forbidden: You don't have permission to access this resource.`;
      case 404:
        return `Not Found: The requested resource was not found.`;
      case 408:
        return `Request Timeout.`;
      case 500:
        return `Internal Server Error. Please try again later.`;
      case 503:
        return `Service Unavailable. Please try again later.`;
      default:
        return `Unexpected Server Error: ${error.status} - ${this.extractErrorMessage(error)}`;
    }
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    // Try to extract a meaningful message from the error response body if possible
    if (error.error) {
      if (typeof error.error === 'string') {
        return error.error;
      } else if (error.error.message) {
        return error.error.message;
      } else if (error.error.errors && Array.isArray(error.error.errors)) {
        return error.error.errors.join(', ');
      }
    }
    return error.statusText || 'Unknown error';
  }
}
