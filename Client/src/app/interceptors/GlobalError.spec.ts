import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorInterceptor } from './GlobalErrorInterceptor';
import { TimeoutError } from 'rxjs';

describe('GlobalErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: GlobalErrorInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should pass through successful responses', done => {
    httpClient.get('/test').subscribe(response => {
      expect(response).toEqual({ success: true });
      done();
    });

    const req = httpMock.expectOne('/test');
    req.flush({ success: true });
  });

  it('should catch 404 error', done => {
    httpClient.get('/not-found').subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error: Error) => {
        expect(error.message).toContain('Not Found');
        done();
      }
    });

    const req = httpMock.expectOne('/not-found');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should catch 500 error', done => {
    httpClient.get('/server-error').subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error: Error) => {
        expect(error.message).toContain('Internal Server Error');
        done();
      }
    });

    const req = httpMock.expectOne('/server-error');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should catch network errors (offline)', done => {
    // Simulate offline
    spyOnProperty(navigator, 'onLine').and.returnValue(false);

    httpClient.get('/offline').subscribe({
      next: () => fail('should have failed with offline error'),
      error: (error: Error) => {
        expect(error.message).toContain('No Internet Connection');
        done();
      }
    });

    const req = httpMock.expectOne('/offline');
    req.error(new ProgressEvent('error'));
  });

  it('should catch timeout error', done => {
    // Override the timeout in interceptor for test (if needed)
    // We'll simulate a timeout by not flushing the request

    httpClient.get('/timeout').subscribe({
      next: () => fail('should have failed with timeout error'),
      error: (error: Error) => {
        expect(error.message).toContain('timed out');
        done();
      }
    });

    const req = httpMock.expectOne('/timeout');
    // Do not flush or error, simulate timeout by letting it timeout naturally (the interceptor timeout)
    // Jasmine test default timeout might need to be increased or test adapted for timeouts
  });

});
