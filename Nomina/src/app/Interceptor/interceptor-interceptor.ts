import { HttpInterceptorFn } from '@angular/common/http';

export const interceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');

  if (username && password) {    
    const authHeader = 'Basic ' + btoa(`${username}:${password}`);    
    const authRequest = req.clone({
      setHeaders: {
        Authorization: authHeader,
      },
    });    
    return next(authRequest);
  }

  return next(req);
};
