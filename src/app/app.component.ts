import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ENV } from './core/env.config';
import { JadoreService } from './service/jadore.service';
import { Router } from '@angular/router';
export interface Message {
  type: string;
  message: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  isOpen = false;
  loading = false;
  messages: Message[] = [];
  chatForm = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });
  @ViewChild('scrollMe') private myScrollContainer: any;

  isLoggedIn:boolean = false;
  user:any;
  ngOnInit() {

    this.service.isLoggedIn$.subscribe(state=>{
      this.isLoggedIn = state;
      if(this.isLoggedIn){
      if(sessionStorage.getItem("currentUser") != null && sessionStorage.getItem("currentUser") != undefined){
        this.service.setIsLoggedIn(true);
        this.user = JSON.parse(sessionStorage.getItem("currentUser") || "");
      }
    }else{
        sessionStorage.removeItem("currentUser");
    }
    })
    
  }

  constructor( private http: HttpClient,  private service: JadoreService, private router: Router) {
    this.messages.push({
      type: 'client',
      message: 'Hi, I am your support agent. How can I help you?',
    });
  }

  openSupportPopup() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    const sentMessage = this.chatForm.value.message!;
    this.loading = true;
    this.messages.push({
      type: 'user',
      message: sentMessage,
    });
    this.chatForm.reset();
    this.scrollToBottom();
    this.http.post(`${ENV.API_HOST_URL}/message`, { prompt: sentMessage }).subscribe((response: any) => {
      this.loading = false;
      this.messages.push({
        type: 'client',
        message: response.message,
      });
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.myScrollContainer.nativeElement.scrollTop =
          this.myScrollContainer.nativeElement.scrollHeight + 500;
      } catch (err) { }
    }, 150);
  }

  logout() {
    this.service.setIsLoggedIn(false);
    sessionStorage.removeItem("currentUser");
    this.router.navigate(['/sign-in']);

  }
}