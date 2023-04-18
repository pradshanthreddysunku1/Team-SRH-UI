import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ENV } from '../core/env.config';
import { JadoreService } from '../service/jadore.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CustomValidators, CustomValidatorsPassword } from '../sign-up/custom-validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  
  show_button: boolean = false;
  disPlayErrors: boolean = false;
  show_eye: boolean = false;
  isSuccess:boolean = false;
  email:string = '';

  ResetPasswordForm: FormGroup;

  get fields_ResetPassword_form(): { [key: string]: AbstractControl } {
    return this.ResetPasswordForm.controls;
  }

  constructor(private router: Router, private route: ActivatedRoute, private service: JadoreService, private toastr: ToastrService,private formBuilder: FormBuilder) {

    this.ResetPasswordForm = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(2)]],
      confirmPassword: [null, Validators.compose([Validators.required,
      CustomValidators.patternValidator(/\d/, { hasNumber: true }),
      CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
      CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
      CustomValidators.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { hasSpecialCharacters: true }),
        Validators.minLength(8)])],
    }, {
      validators: [CustomValidatorsPassword.match('password', 'confirmPassword')]
    });
    this.route.queryParams.subscribe(params => {
      if (params['email'] !== undefined && params['email'] !== null && params['email'] !== '') {
        this.email = params['email']
      }
    })

  }
  resetPassword(){
    let obj = { email:this.email,password: this.ResetPasswordForm.get('password')?.value }
    
      let url = `${ENV.API_HOST_URL}/reset-password`;
      this.service.post(obj, url).subscribe(
        data => {
         if(data["success"] == true){
          this.toastr.success(data.message);
          this.ResetPasswordForm.reset();
         }
        },
        err => {
          console.log('err', err)
          this.toastr.error(err.error.message);
        },
        () => {
          console.log("Complete function triggered.")
        }
      )
    
  
  }

  onPasswordChange() {
    if (this.ResetPasswordForm.get('confirmPassword')?.value == this.ResetPasswordForm.get('password')?.value) {
      this.ResetPasswordForm.get('confirmPassword')?.setErrors(null);
    } else {
      this.ResetPasswordForm.get('confirmPassword')?.setErrors({ mismatch: true });
    }
    console.log(this.ResetPasswordForm.errors)
  }
  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }
}


