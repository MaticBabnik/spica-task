import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from "./auth.service"

export const authGuard: CanActivateFn = () => {
    const isAuth = inject(AuthService).Authorized;

    if (isAuth) return true;

    const redirect = inject(Router).parseUrl('/');
    return new RedirectCommand(redirect, { skipLocationChange: true });
};
