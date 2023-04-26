import { ChangeDetectorRef, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ENV } from 'src/app/core/env.config';
import { JadoreService } from 'src/app/service/jadore.service';

@Component({
  selector: 'app-my-feedback',
  templateUrl: './my-feedback.component.html',
  styleUrls: ['./my-feedback.component.css']
})
export class MyFeedbackComponent {

  feedbacks:any = [];
  user:any;
  idToEdit:any;
  feedbackText: any;
  selectedFeedback:any;
  p: number = 1;

  ngOnInit(){
    
  }

  constructor( private service: JadoreService, private toastr: ToastrService, private cd:ChangeDetectorRef) {
   
    if(sessionStorage.getItem("currentUser") != null && sessionStorage.getItem("currentUser") != undefined){
      this.user = JSON.parse(sessionStorage.getItem("currentUser") || "");
    }
    this.getFeedbacks();
  }

  getFeedbacks(){
    let url = `${ENV.API_HOST_URL}/feedback/${this.user.id}`;
    this.service.get(url).subscribe(data => {
      this.feedbacks = data;
      // this.cd.detectChanges();
      console.log("feedback key", data)
    });
  }
  deleteFeedback(id:string){

    let url = `${ENV.API_HOST_URL}/feedback/${id}`;
    let feedback = this.feedbacks.filter((feedback: { _id: string; }):any => feedback._id==id)
    this.service.post( { "inputText" : feedback[0].inputText, "outputText" : feedback[0].outputText },url).subscribe(data => {
      if(data["success"] == true){
        this.feedbacks = this.feedbacks.filter((feedback: { _id: string; }):any => feedback._id!=id)
        this.toastr.success("The feedback has been successfully deleted")
      }else{
        
        this.toastr.error("Something went wrong, Please try after sometime")
      }
    });
  }

  editFeedback(id:string){
    let selectedFeedback = this.feedbacks.filter((feedback: { _id: string; }):any => feedback._id==id);
    this.idToEdit = id;
    this.feedbackText = selectedFeedback[0].feedbackText;
    this.selectedFeedback = selectedFeedback[0];
  }

  sendFeedback(){
    let obj = {
      "fromLanguage": this.selectedFeedback.fromLanguage,
      "inputText": this.selectedFeedback.inputText,
      "toLanguage": this.selectedFeedback.toLanguage,
      "outputText": this.selectedFeedback.outputText,
      "feedbackText": this.feedbackText,
      "user": 
        {
          "id": this.user.id
        }
    }
    // console.log(obj)

    this.service.put(obj, `${ENV.API_HOST_URL}/feedback/${this.idToEdit}`).subscribe(res=> {
      if(res["_id"]){
        this.toastr.success("Feedback is successfully updated!");
        this.feedbackText = '';
        this.getFeedbacks();
      }else{
        this.toastr.error("Something went wrong, please try after sometime!");
      }
    })
  }

}
