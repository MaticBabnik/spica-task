import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";

import { AuthService } from "./auth.service";

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
            console.log("Got 401 clearing session");
            if (error.status === 401) {
                auth.clear();
                router.navigate(["/settings"]);
            }
            return throwError(() => error);
        })
    );
};
