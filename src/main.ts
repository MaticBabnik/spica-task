import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { AuthService } from "./app/auth.service"
import { ApplicationRef } from '@angular/core';



bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err))
    .then(x => {
        //FIXME(mbabnik): remove this
        //@ts-ignore
        window.auth = (x as ApplicationRef).injector.get(AuthService)
    })


//@ts-ignore
window.fetchUsers = () => {
    // /api/v1 / Users
    fetch('https://api4.allhours.com/api/v1/Users', {
        method: 'GET',
        headers: {
            //@ts-ignore
            Authorization: window.auth.Authorization
        }
    })
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}