import { HttpInterceptorFn } from '@angular/common/http';

export const interceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');

  if (!username || !password) {
    return next(req);
  }

  const authHeader = 'Basic ' + btoa(`${username}:${password}`);

  return next(req.clone({
    setHeaders: {
      Authorization: authHeader
    }
  }));
};
