import { Component, OnInit } from '@angular/core';
import { OnsNavigator } from 'ngx-onsenui';
import { LoginResponse } from '../../shared/model/security/login.model';
import { DashboardPage } from '../dashboard/dashboard.page';

@Component({
    selector: 'ons-page[login]',
    templateUrl: './login.page.html',
})
export class LoginPage implements OnInit {
    constructor(private navigator: OnsNavigator) {

    }

    ngOnInit(): void {
    }

    onSuccess(response: LoginResponse): void {
        this.navigator.element.replacePage(DashboardPage);
    }
}
