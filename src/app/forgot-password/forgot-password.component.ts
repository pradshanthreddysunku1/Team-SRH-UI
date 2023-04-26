import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ENV } from '../core/env.config';
import { JadoreService } from '../service/jadore.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  ForgotPasswordForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private service: JadoreService, private router: Router) {
    this.ForgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email, Validators.pattern('^(?:\s)?[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,}(?:\s)?$')]]
    });
  }

  get fields_ForgotPassword_form(): { [key: string]: AbstractControl } {
    return this.ForgotPasswordForm.controls;
  }

  sendLink(){
    let url = `${ENV.API_HOST_URL}/forgot-password`;
    this.service.post({
      email: this.ForgotPasswordForm.get('email')?.value}, url).subscribe(
      data => {
       if(data["success"] == true){
        this.toastr.success(data.message);
        this.ForgotPasswordForm.reset();
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


 

}
