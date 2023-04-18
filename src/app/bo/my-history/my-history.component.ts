import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ENV } from 'src/app/core/env.config';
import { JadoreService } from 'src/app/service/jadore.service';

@Component({
  selector: 'app-my-history',
  templateUrl: './my-history.component.html',
  styleUrls: ['./my-history.component.css']
})
export class MyHistoryComponent {

  histories:any = [];
  user:any;
  selectedHistory:any;

  ngOnInit(){
    
  }

  constructor( private service: JadoreService, private toastr: ToastrService) {
   
    if(sessionStorage.getItem("currentUser") != null && sessionStorage.getItem("currentUser") != undefined){
      this.user = JSON.parse(sessionStorage.getItem("currentUser") || "");
    }
    this.getHistories();
  }

  getHistories(){
    let url = `${ENV.API_HOST_URL}/history/${this.user.id}`;
    this.service.get(url).subscribe(data => {
      this.histories = data;
    });
  }
  deleteHistory(id:string){

    let url = `${ENV.API_HOST_URL}/history/${id}`;
    let history = this.histories.filter((feedback: { _id: string; }):any => feedback._id==id)
    this.service.post({ "inputText" : history[0].inputText, "outputText" : history[0].outputText }, url).subscribe(data => {
      if(data["success"] == true){
        this.histories = this.histories.filter((feedback: { _id: string; }):any => feedback._id!=id)
        this.toastr.success("The history item has been successfully deleted")
      }else{
        
        this.toastr.error("Something went wrong, Please try after sometime")
      }
    });
  }

}
