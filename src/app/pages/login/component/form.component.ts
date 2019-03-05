
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../../../shared/security/session.service';
import { makeLoginPayload, LoginResponse } from '../../../shared/model/security/login.model';
import { ForgotPasswordPage } from '../../forgot-password/forgot-password.page';
import { OnsNavigator } from 'ngx-onsenui';


@Component({
    selector: 'login-form',
    templateUrl: './form.component.html',
})
export class LoginForm implements OnInit {
    loginForm: FormGroup;
    isSubmitting: boolean = false;    


    @Output()
    success = new EventEmitter<LoginResponse>();

    constructor(private formBuilder: FormBuilder, private sessionService: SessionService, private navigator: OnsNavigator) {
      
    }

    ngOnInit(): void {
      this.createForm();
    }

    createForm(): void {
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
      });
    }

    onSubmit(): void {
      this.isSubmitting = true;

      const successHandler = (response: LoginResponse) => {
        this.success.emit(response);
        this.isSubmitting = false;
      };

      const errorHandler = error => { 
        this.isSubmitting = false;
        this.loginForm.setErrors({'formError': 'Invalid Credentials!'})
      };
  
      this.sessionService.login(makeLoginPayload(this.loginForm.value)).subscribe(successHandler, errorHandler);
    } 

    gotoForgotPassword(): void {
        this.navigator.element.pushPage(ForgotPasswordPage);
    }
}
