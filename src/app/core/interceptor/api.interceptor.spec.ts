import { TestBed } from '@angular/core/testing';
import {
  HttpInterceptorFn,
  HttpParams,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import { apiInterceptor } from './api.interceptor';
import { environment } from '@/environments/environment';
import { of } from 'rxjs';
const mockApiUrl = 'https://api.example.com/';
const mockApiKey = 'test-api-key';

describe('apiInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => apiInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
    (environment.API_URL as any) = mockApiUrl;
    (environment.API_KEY as any) = mockApiKey;
  });

  it('Test Case #1 - should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('Test Case #2 - should pass through requests to assets unchanged', (done) => {
    const request = new HttpRequest('GET', 'assets/data.json');

    const next = jasmine
      .createSpy('next')
      .and.callFake((req: HttpRequest<any>) => {
        expect(req.url).toBe('assets/data.json'); // unchanged
        return of(new HttpResponse({ status: 200 }));
      });

    apiInterceptor(request, next).subscribe((res) => {
      expect(res instanceof HttpResponse).toBeTrue();
      expect(next).toHaveBeenCalled();
      done();
    });
  });

  it('Test Case #3 - should modify request with API_URL and appid param', (done) => {
    const request = new HttpRequest('GET', 'weather?q=London');

    const next = jasmine
      .createSpy('next')
      .and.callFake((req: HttpRequest<any>) => {
        expect(req.url).toBe(`${mockApiUrl}weather?q=London`);
        expect(req.params instanceof HttpParams).toBeTrue();
        expect(req.params.get('appid')).toBe(mockApiKey);
        return of(new HttpResponse({ status: 200 }));
      });

    apiInterceptor(request, next).subscribe((res) => {
      expect(res instanceof HttpResponse).toBeTrue();
      expect(next).toHaveBeenCalled();
      done();
    });
  });
});
