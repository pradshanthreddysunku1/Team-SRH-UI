import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ENV } from 'src/app/core/env.config';
import { CustomValidators, CustomValidatorsPassword } from '../../sign-up/custom-validators';
import { JadoreService } from '../../service/jadore.service';
import { VoiceRecognitionService } from 'src/app/service/voice-recognition.service';
import { Text2speechService } from 'speech-synthesis-text-to-speech';
declare var webkitSpeechRecognition: any;
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

  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  public text = '';
  public tempWords = '';
  show_button: boolean = false;
  disPlayErrors: boolean = false;
  show_eye: boolean = false;
  user: any;
  inputText: string = '';
  userUpdateForm:FormGroup;
  passwordUpdateForm: FormGroup;
  fromLanguagesList: Array<Language> = [];
  toLanguagesList: Array<Language> = [];
  from: string=''
  to: string = '';
  textInput: string = '';
  translatedText: string = '';
  isLoading: boolean = false;
  isStarted = false;
  isStoppedAutomatically = true;
  isShowMic: boolean = true;
  isShowStop: boolean = false;

  constructor(private router: Router, private text2speechService:Text2speechService,public serviceVc: VoiceRecognitionService ,private service: JadoreService, private formBuilder: FormBuilder, private toastr: ToastrService,) {
    // let extras = this.router.getCurrentNavigation()?.extras?.state;
    if(sessionStorage.getItem("currentUser") != null && sessionStorage.getItem("currentUser") != undefined){
      this.user = JSON.parse(sessionStorage.getItem("currentUser") || "");
    }else{
      this.toastr.error("You must sign-in to access your profile")
      this.router.navigate(["/sign-in"]);
    }
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
      this.fromLanguagesList = this.fromLanguagesList.sort((a, b) => a.language > b.language ? 1 : -1);
      this.toLanguagesList = this.toLanguagesList.sort((a, b) => a.language > b.language ? 1 : -1);

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
      this.init($event.target.value)
      this.from = $event.target.value;
    } else {
      this.to = $event.target.value;
    }
  }


  translate(text: any) {
    this.isLoading = true;
    this.translatedText = '';
    let url = `${ENV.API_HOST_URL}/translate`;
    this.service.post({from:this.from, to: this.to, term:text.value}, url).subscribe(data => {
      this.translatedText = data.term;
      this.isLoading = false;
    });

  }

  clearInputs() {
    this.inputText = '';
    this.translatedText = '';
    this.text = '';
    this.isShowStop = false;
    this.isShowMic = true;
  }
  swap(from:any, to:any,inputText:any,translatedText:any) {
    this.from =to;
    this.to = from;
    this.translatedText = inputText;
    this.inputText = translatedText;
  }
  startService() {
    this.text = '';
    this.isShowMic = false;
    this.isShowStop = true;
   this.start();
    this.inputText = this.text;
  }

  stopService() {
    this.isShowMic = true;
    this.isShowStop = false;
    this.stop()

    if (this.text.length > 0) {
      this.translate({ value: this.text });
    }
  }

  playAudio() {
    console.log('from', this.from)
    let speech = new SpeechSynthesisUtterance();
    speech.lang = this.from;
    speech.text = this.inputText;
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  }

  playAudio2() {
    let speech = new SpeechSynthesisUtterance();
    speech.lang = this.to;
    speech.text = this.translatedText;
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  }





  init(lng: any) {

    this.recognition.interimResults = true;
    this.recognition.lang = lng;
    this.recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.tempWords = transcript;
      this.inputText = this.tempWords;
      console.log(transcript);
    });
    this.recognition.addEventListener('end', (_condition: any) => {
      this.wordConcat();
      console.log('automatic!!');
      if (this.isStoppedAutomatically) {
        if (this.text.length > 0) {
          this.translate({ value: this.text });
        }
        this.recognition.stop();
        this.recognition.start();
        this.isStoppedAutomatically = true;
      }
    });
  }

  start() {
    if (!this.isStarted) {
      this.recognition.start();
      this.isStarted = true;
      console.log('Speech recognition started');
    }
    return true;
  }
  stop() {
    if (this.isStarted) {
      this.isStoppedAutomatically = false;
      this.wordConcat();
      this.recognition.stop();
      this.isStarted = false;
      console.log('End speech recognition2');
    }
    return false;
  }
  wordConcat() {
    this.text = this.text + ' ' + this.tempWords + '.';
    this.tempWords = '';
  }

}
