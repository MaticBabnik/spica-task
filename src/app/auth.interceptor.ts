import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from "./auth.service"

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const { Authorization } = inject(AuthService);

    if (Authorization) {
        req = req.clone({
            setHeaders: {
                Authorization
            }
        })
    }

    return next(req);
};
