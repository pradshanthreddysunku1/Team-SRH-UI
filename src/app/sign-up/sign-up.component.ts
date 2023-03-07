import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CustomValidators, CustomValidatorsPassword } from './custom-validators';
import { JadoreService } from '../service/jadore.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ENV } from '../core/env.config'
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signUpForm: FormGroup;
  show_button: boolean = false;
  disPlayErrors: boolean = false;
  show_eye: boolean = false;
  constructor(private formBuilder: FormBuilder, private service: JadoreService, private toastr: ToastrService, private router:Router) {
    this.signUpForm = this.formBuilder.group({
      firstName: [null, [Validators.required, Validators.minLength(2)]],
      lastName: [null, [Validators.required, Validators.minLength(2)]],
      password: [null, Validators.compose([Validators.required,
      CustomValidators.patternValidator(/\d/, { hasNumber: true }),
      CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
      CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
      CustomValidators.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { hasSpecialCharacters: true }),
      Validators.minLength(8)])],

      confirmPassword: [null],
      userName: [null, [Validators.required, Validators.minLength(2)]],
      email: [null, [Validators.required, Validators.email, Validators.pattern('^(?:\s)?[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,}(?:\s)?$')]]
    }, {
      validators: [CustomValidatorsPassword.match('password', 'confirmPassword')]
    });
  }
  get fields_signUp_form(): { [key: string]: AbstractControl } {
    return this.signUpForm.controls;
  }
  onPasswordChange() {
    if (this.signUpForm.get('confirmPassword')?.value == this.signUpForm.get('password')?.value) {
      this.signUpForm.get('confirmPassword')?.setErrors(null);
    } else {
      this.signUpForm.get('confirmPassword')?.setErrors({ mismatch: true });
    }
    console.log(this.signUpForm.errors)
  }
  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }
  signUp() {
    let obj = {
      firstName: this.signUpForm.get('firstName')?.value,
      lastName: this.signUpForm.get('lastName')?.value,
      password: this.signUpForm.get('password')?.value,
      username: this.signUpForm.get('userName')?.value,
      email: this.signUpForm.get('email')?.value,

    }
    let url = `${ENV.API_HOST_URL}/auth/signup`;
    this.service.post(obj, url).subscribe(
      data => {
        this.router.navigate(['/sign-in'])
        this.toastr.success('Sign-in to open your account', 'Your account has been successfully created!' );
      },
      err => {
        console.log('err', err)
        this.toastr.error(err.error.message);
      },
      () => {
        console.log("Complete function triggered.")
      }
    );
  }
}
