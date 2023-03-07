import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ENV } from 'src/app/core/env.config';
import { CustomValidators, CustomValidatorsPassword } from '../../sign-up/custom-validators';
import { JadoreService } from '../../service/jadore.service';

interface Language {
  language: string,
  code: string
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent {
  show_button: boolean = false;
  disPlayErrors: boolean = false;
  show_eye: boolean = false;
  user: any;
  userUpdateForm:FormGroup;
  passwordUpdateForm: FormGroup;
  fromLanguagesList: Array<Language> = [];
  toLanguagesList: Array<Language> = [];
  from: string=''
  to: string = '';
  text: string = '';
  translatedText: string = '';

  constructor(private router: Router, private service: JadoreService, private formBuilder: FormBuilder, private toastr: ToastrService,) {
    let extras = this.router.getCurrentNavigation()?.extras?.state;
    this.user = extras?.['user'];
    this.userUpdateForm = this.formBuilder.group({
      firstName: [null, [Validators.required, Validators.minLength(2)]],
      lastName: [null, [Validators.required, Validators.minLength(2)]],
      email: [null, [Validators.required, Validators.email, Validators.pattern('^(?:\s)?[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,}(?:\s)?$')]]
    });
       this.userUpdateForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email
      })
    this.passwordUpdateForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required, Validators.minLength(2)]],
      newPassword: [null, Validators.compose([Validators.required,
      CustomValidators.patternValidator(/\d/, { hasNumber: true }),
      CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
      CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
      CustomValidators.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { hasSpecialCharacters: true }),
        Validators.minLength(8)])],
      confirmPassword: [null],
    }, {
      validators: [CustomValidatorsPassword.match('newPassword', 'confirmPassword')]
    });
    let url = `${ENV.API_HOST_URL}/languages`;
    this.service.get(url).subscribe(data => {
      this.toLanguagesList = data;
      this.fromLanguagesList = data;
    });
  }
  get fields_password_update_form(): { [key: string]: AbstractControl } {
    return this.passwordUpdateForm.controls;
  }


  updateUserInfo() {
    this.service.put(this.userUpdateForm.getRawValue(), `${ENV.API_HOST_1_URL}/user/${this.user.id}`).subscribe(data => {
      this.user = data;
      this.toastr.success('Your profile is updated succesfully')
    })
  }


  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }
  onPasswordChange() {
    if (this.passwordUpdateForm.get('confirmPassword')?.value == this.passwordUpdateForm.get('password')?.value) {
      this.passwordUpdateForm.get('confirmPassword')?.setErrors(null);
    } else {
      this.passwordUpdateForm.get('confirmPassword')?.setErrors({ mismatch: true });
    }
    console.log(this.passwordUpdateForm.errors)
  }
  updatePassword() {
    let obj = {
      ...this.passwordUpdateForm.getRawValue(),
      username:this.user.username
    }
    this.service.post(obj, `${ENV.API_HOST_1_URL}/user/resetpassword`).subscribe(
      res => {
        this.toastr.success(res.message);
        this.passwordUpdateForm.reset();
      },
        err => {
          this.toastr.error(err.error.message);
      }
    )
  }

  Change($event: any, type: string) {
    if (type == 'from') {
      this.from = $event.target.value;
    } else {
      this.to = $event.target.value;
    }

  }
  translate(text:any) {
    let url = `${ENV.API_HOST_URL}/translate`;
    this.service.post({from:this.from, to: this.to, term:text.value}, url).subscribe(data => {
      this.translatedText = data.term;
    });

  }

}
