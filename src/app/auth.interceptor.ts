import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.Authorization) {
        req = req.clone({
            setHeaders: {
                Authorization: auth.Authorization,
            },
        });
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            console.log('Got 401 clearing session')
            if (error.status === 401) {
                auth.clear();
                router.navigate(["/settings"]);
            }
            return throwError(() => error);
        })
    );
};
