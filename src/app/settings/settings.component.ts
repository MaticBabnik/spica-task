import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCard, MatCardContent, MatCardTitle, MatCardHeader, MatCardActions } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';

import { FormControl } from '@angular/forms';
import { AuthService } from './auth.service';
import { LoadingComponent } from '../common/loading.component';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatCard,
        MatButton,
        MatInput,
        MatCardActions,
        MatCardContent,
        MatCardHeader,
        MatCardTitle,
        LoadingComponent
    ],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent {
    auth = inject(AuthService);
    loading = false;

    authError: string | undefined = undefined

    loginForm = new FormGroup({
        clientId: new FormControl('', [Validators.required]),
        clientSecret: new FormControl('', [Validators.required]),
    })

    async tryAuth() {
        if (!this.loginForm.valid) return;

        this.loading = true
        try {
            if (!await this.auth.authenticate(
                this.loginForm.value.clientId!,
                this.loginForm.value.clientSecret!
            )) {
                this.authError = 'Invalid credentials';
            }
        } catch (e) {
            this.authError = 'Unknown error';
            console.error('Auth error:', e)
        } finally {
            this.loading = false;
        }
    }
}
