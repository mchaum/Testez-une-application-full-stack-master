import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TestAuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const testToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5b2dhQHN0dWRpby5jb20iLCJpYXQiOjE3MzYzNDMzMjAsImV4cCI6MTgzNjQyOTAyMH0.W6ymliWvtyYM6ILmTp4rCkVKgANMksp8o8VI0TWyDnovcny7Yi0SyN43FCajvTLd-IMq_frDVqsW3wFzB0YowA'; // Token factice pour les tests
    const clonedRequest = request.clone({
      setHeaders: { Authorization: `Bearer ${testToken}` }
    });
    return next.handle(clonedRequest);
  }
}
