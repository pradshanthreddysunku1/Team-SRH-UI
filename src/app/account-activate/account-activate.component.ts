import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JadoreService } from '../service/jadore.service';
import { ToastrService } from 'ngx-toastr';
import { ENV } from '../core/env.config';

@Component({
  selector: 'app-account-activate',
  templateUrl: './account-activate.component.html',
  styleUrls: ['./account-activate.component.css']
})


export class AccountActivateComponent {
  isSuccess:boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private service: JadoreService, private toastr: ToastrService) {
    this.route.queryParams.subscribe(params => {
      if (params['id'] !== undefined && params['id'] !== null && params['id'] !== '') {
    let url = `${ENV.API_HOST_URL}/account-activate?id=${params['id']}`;
        this.service.post({}, url).subscribe(
          data => {
           if(data["success"] == true){
            this.isSuccess = true;
            this.toastr.success(data.message);
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
    })

  }
}
