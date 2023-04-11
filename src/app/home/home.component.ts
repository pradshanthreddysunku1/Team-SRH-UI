import { Component } from '@angular/core';
import { JadoreService } from '../service/jadore.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  courses: any = [];
  user: any;
  constructor(private toastr: ToastrService, private router: Router) {

  }
  ngOnInit() {

  }

  verifySignIn(){
    if(sessionStorage.getItem("currentUser") != null && sessionStorage.getItem("currentUser") != undefined){
      this.router.navigate(["/bo/translation"]);
    }else{
      this.toastr.error("You must sign-in to access your profile")
      this.router.navigate(["/sign-in"]);
    }
  }
}
