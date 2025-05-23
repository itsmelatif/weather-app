  import { HttpInterceptorFn } from '@angular/common/http';
  import { environment } from '@environments/environment';

  export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const apiKey = environment.API_KEY;
    if (req.url.includes('assets/')) {
      return next(req);
    }

    const apiReq = req.clone({
      url: `${environment.API_URL}${req.url}`,
      setParams: {
        appid: apiKey,
      },
    });
    return next(apiReq);
  };
