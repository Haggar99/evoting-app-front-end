import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

import { SegmentChangeEventDetail } from '@ionic/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  loginForm: FormGroup;
  isVotantOrAdmin: string = 'votant';
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  
  onSubmit() {
    const formValue = this.loginForm.value;
    console.log(formValue)
    if (this.isVotantOrAdmin === 'votant') {
        this.authService
        .loginVotant(formValue.email, formValue.password)
        .subscribe(isAuth => {
          if (isAuth) {
            this.router.navigateByUrl('/');
          } else {
            return;
          }
        });
    } else {
      console.log('administrateur: '+formValue);  
      // this.authService.loginAdmin(formValue.email, formValue.password);
    }
  }
  
  onChangeUser(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event);
    //this.loginForm.controls.phoneNumber.reset();
    //this.loginForm.controls.password.reset();
    this.isVotantOrAdmin = event.detail.value;
  }
}
