import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JadoreService } from '../service/jadore.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {ENV } from '../core/env.config'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  isAccountActivated:boolean = false;
  signInForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private service: JadoreService, private router: Router) {
    this.signInForm = this.formBuilder.group({
      password: [null, Validators.required],
      username: [null, Validators.required],
    });
  }


  signIn() {

    let obj = {
      password: this.signInForm.get('password')?.value,
      username: this.signInForm.get('username')?.value
    }
    let url = `${ENV.API_HOST_URL}/auth/signin`;
    this.service.post(obj, url).subscribe(
      (data):any => {
        console.log('data', data)
        if(data['isActivated'] == true){
          sessionStorage.setItem("currentUser", JSON.stringify(data))
          this.service.setIsLoggedIn(true);
          this.router.navigate(['/bo/translation']);
        }else{
          this.toastr.error("Your account is not activated, check your email to activate your account!");
        }
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
