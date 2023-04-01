import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ENV } from 'src/app/core/env.config';
import { CustomValidators, CustomValidatorsPassword } from '../sign-up/custom-validators';
import { JadoreService } from '../service/jadore.service';
import { VoiceRecognitionService } from 'src/app/service/voice-recognition.service';
import { Text2speechService } from 'speech-synthesis-text-to-speech';
declare var webkitSpeechRecognition: any;
interface Language {
  language: string,
  code: string
}

@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.css']
})
export class TranslationComponent {
  mostPopularPharses = [
    {
      categeory: 'basics',
      questions: [
        "Hello", "Good morning",
        "Nice to meet you", "Good bye",
        "Good morning", "How are you?",
        "Good night"
      ],
      isShow : true
    },
    {

      categeory: 'Greetings',
      questions: [
        "Hello", "Nice to meet you",
        "Have a nice day", "Let the good times roll",
        "Good morning", "Good afternoon",
        "Good evening", "Good night",
        "Goodbye", "Sweet dreams",
        "Have a good weekend", "See you later",
        "Welcome", "Best wishes",
        "This is an emergency."
      ],
      isShow: false
    },
    {
      categeory: 'Small talk',
      questions: [
        "Please", "Thank you",
        "Excuse me", "No thank you",
        "I am sorry", "God bless you",
        "Safe travels", "Get well soon!",
        "Help me", "Enjoy your meal",
        "I am bored", "I am tired",
        "The Lord's prayer", "Power of attorney",
        "Once upon a time"
      ],
      isShow: false
    },
    {

      categeory: 'Questions',
      questions: [
        "What is your name?", "How are you doing?",
        "Where are you from?", "Where are you?",
        "What are you doing?", "How was your day?",
        "How old are you?", "Where are you going?",
        "Who are you?", "Are you okay?",
        "How can I help you?", "Where do you live?",
        "Do you know where you are?", "Are you hungry?",
        "Where is the toilet?", "When is your birthday?"
      ],
      isShow: false
    },
    {

      categeory: 'Responses',
      questions: [
        "You're welcome", "Same to you",
        "I agree", "I don't know",
        "I understand", "I don't understand",
        "I am hungry", "I don't care",
        "I am good", "I go to work",
        "I hope"
      ],
      isShow: false
    },
    {
      categeory: 'Social',
      questions: [
        "Happy Birthday!", "Belated Happy Birthday!",
        "Happy Anniversary!", "Happy Friday",
        "Happy New Year!"
      ],
      isShow: false
    },
    {

      categeory: 'Relations',
      questions: [
        "Mother", "Father",
        "Sister", "Brother",
        "Friend", "Daughter",
        "Son", "Family",
        "Wife", "Husband",
        "Grandmother", "Grandfather",
        "Daughter-in-law", "Son-in-law",
        "Sister-in-law", "Brother-in-law"
      ],
      isShow: false
    },
    {
      categeory: 'Romance',
      questions: [
        "I love you", "I miss you",
        "I love you too", "I like you",
        "You are beautiful", "We love you",
        "I want you", "I love you more",
        "Good morning, beautiful.", "Hello, beautiful.",
        "Very pretty", "Will you marry me?",
        "I will miss you", "You are very beautiful"
      ],
      isShow: false
    },
    {
      categeory: 'Instructions',
      questions: [
        "Good job", "Play well",
        "Be quiet", "Go away",
        "Hurry up", "Sit down",
        "Wake up", "Leave me alone",
        "Follow me", "Go to sleep",
        "Go to bed"
      ],
      isShow: false
    },
    {

      categeory: 'Shopping',
      questions: [
        "How much does it cost?", "That is expensive!",
        "Is it free?", "I would like to change money.",
        "Is there an ATM?"
      ],
      isShow: false
    },
    {

      categeory: 'Travel: Questions:',
      questions: [
        "Where is the airport?", "Where is the train station?",
        "Where is the subway station?", "Where is the bus station?",
        "Where is the taxi stand?", "Where can I buy a ticket?",
        "How much is a ticket?", "I would like a ticket.",
        "I would like to change my ticket.", "Is it direct?",
        "When does it leave?", "When does it arrive?"
      ],
      isShow: false
    },

    {
      categeory: 'Transportation',
      questions: [
        "Please call a taxi for me.", "Where can I rent a car?",
        "How much will it cost?", "Which gate?",
        "Where is the gate?", "Where is baggage claim?",
        "Which platform?", "Where is the platform?",
        "Where should I get off?", "Where do I change trains?",
        "Here is my passport.", "Do I need a visa?",
        "I have nothing to declare.", "I have something to declare."
      ],
      isShow: false
    },
    {

      categeory: 'Lodging',
      questions: [
        "I would like to make a reservation.", "I would like a room.",
        "How much is the room?", "Is it air conditioned?",
        "Is there a restaurant?", "Is there room service?",
        "I need to change my reservation.", "Do you have a vacancy?",
        "No vacancy", "Is breakfast included?",
        "I have a reservation.", "My room needs to be cleaned.",
        "I would like to pay my bill."
      ],
      isShow: false
    },
    {
      categeory: 'Directions',
      questions: [
        "Right", "Left",
        "Straight ahead",
        "North",
        "South", "East",
        "West", "Uphill",
        "Downhill", "Traffic light",
        "Stop sign"
      ],
      isShow: false
    },
    {

      categeory: 'Dining: General:',
      questions: [
        "Where is the restaurant?", "May I see a menu?",
        "I would like breakfast.", "I would like lunch.",
        "I would like dinner.", "I would like a snack.",
        "I would like to pay.", "I'm thirsty.",
        "I would like some water.", "I would like some bottled water.",
        "I would like some carbonated water.", "Is this drinkable water?",
        "I would like some tap water.", "No ice",
        "With ice"
      ],
      isShow: false
    },
    {
      categeory: 'Restrictions',
      questions: [
        "I'm allergic to milk.", "I'm allergic to eggs.",
        "I'm allergic to fish.", "I'm allergic to shellfish.",
        "I'm allergic to tree nuts.", "I'm allergic to peanuts",
        "I'm allergic to wheat.", "I'm allergic to soybeans.",
        "I'm vegetarian.", "I'm vegan.",
        "I don't eat pork.", "I don't eat beef.",
        "I don't eat shellfish."
      ],
      isShow: false
    },
    {

      categeory: 'Emergency: Missing person',
      questions: [
        "Is someone missing?", "What is the person's name?",
        "Is there a nickname?", "Can you show me a recent photograph?",
        "Can you describe the person?", "What were they wearing?",
        "Have they gone missing previously?", "Where did they go last time?",
        "Do they take medications?", "Do they pose a risk to themselves or others?",
        "Where do they like to go?", "Did they say where they were going?",
        "Do they have hobbies or interests that might help locate them?", "Is there family or friends close by that they may have gone to see?",
        "Addresses or walking route?"
      ],
      isShow: false
    },
    {
      categeory: 'Medical',
      questions: [
        "I'm sick.", "I need a doctor.",
        "I need a dentist.", "I need to go to the hospital.",
        "I need to go to a pharmacy.", "I'm pregnant.",
        "I have a fever.", "I have a headache.",
        "I have a sore throat.", "I have a cold.",
        "I have the flu.", "I have a pain in my chest.",
        "I have diarrhea.", "I have allergies.",
        "I have asthma."
      ],
      isShow: false
    },
    {

      categeory: 'Injuries',
      questions: [
        "Something fell on me.", "Something cut me.",
        "I was in an accident.", "I hit my head.",
        "I fell."
      ],
      isShow: false
    },
    {

      categeory: 'Questions',
      questions: [
        "Any allergies?", "Any medical problems that I need to know about?",
        "When did you last eat?", "Can you point to where it hurts?",
        "Does the pain go anywhere?", "How bad is the pain?",
        "Can you describe the pain?", "I need to take your pulse.",
        "I need to check your blood pressure.", "I need to examine you.",
        "Is that okay?", "What happened?",
        "Do you know what’s wrong?", "Have you had this before?",
        "Are you on medications?", "What are the medications?"
      ],
      isShow: false
    },
    {

      categeory: 'Dates & Numbers: times',
      questions: [
        "Morning", "Noon",
        "Afternoon", "Evening",
        "Night", "Midnight"
      ],
      isShow: false
    },
    {

      categeory: 'Relations',
      questions: [
        'Days',
        "Monday", "Tuesday",
        "Wednesday", "Thursday",
        "Friday", "Saturday",
        "Sunday", "Today",
        "Yesterday", "Day before yesterday",
        "Day after tomorrow"
      ],
      isShow: false
    },
    {

      categeory: 'Months',
      questions: [
        "January", "February",
        "March", "April",
        "May", "June",
        "July", "August",
        "September", "October",
        "November", "December"
      ]
    },
    {

      categeory: 'Numbers',
      questions: [
        "One", "Two",
        "Three", "Four",
        "Five", "Six",
        "Seven", "Eight",
        "Nine", "Ten",
        "Twenty", "Thirty",
        "Forty", "Fifty",
        "Hundred", "Thousand",
      ]
    },
    {

      categeory: 'Technology: General',
      questions: [
        "I need a printer.", "I need a projector.",
        "I need to check my email.", "Could you take a photo?",
        "Can you change it to the English setting?", "Is there Wi-Fi?",
        "What is the Wi-Fi password?", "The Wi-Fi isn't working."
      ]
    },
    {

      categeory: 'Devices',
      questions: [
        "What is your phone number?", "I would like to buy a SIM card.",
        "I would like to buy a prepaid phone.", "I need to make a telephone call.",
        "What are the rates?", "I need an adapter.",
        "I need to charge my laptop.", "I need to charge my phone.",
        "I need to check my email.", "What is your email address?",
        "Can you email it to me?", "Can you text it to me?",
        "Can you text me your contact information?", "I lost my laptop."
      ]
    }
  ]
  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  public text = '';
  public tempWords = '';
  show_button: boolean = false;
  disPlayErrors: boolean = false;
  show_eye: boolean = false;
  user: any;
  inputText: string = '';
  fromLanguagesList: Array<Language> = [];
  toLanguagesList: Array<Language> = [];
  from: string = ''
  to: string = '';
  textInput: string = '';
  translatedText: string = '';
  isLoading: boolean = false;
  isStarted = false;
  isStoppedAutomatically = true;
  isShowMic: boolean = true;
  isShowStop: boolean = false;
  images: any = [];
  checked: boolean = false;

  constructor(private router: Router, private text2speechService: Text2speechService, public serviceVc: VoiceRecognitionService, private service: JadoreService, private formBuilder: FormBuilder, private toastr: ToastrService,) {

    let url = `${ENV.API_HOST_URL}/languages`;
    this.service.get(url).subscribe(data => {
      this.toLanguagesList = data;
      this.fromLanguagesList = data;
      this.fromLanguagesList = this.fromLanguagesList.sort((a, b) => a.language > b.language ? 1 : -1);
      this.toLanguagesList = this.toLanguagesList.sort((a, b) => a.language > b.language ? 1 : -1);

    });
  }





  Change($event: any, type: string) {
    if (type == 'from') {
      this.init($event.target.value)
      this.from = $event.target.value;
      console.log('from', this.from)
      if (this.from !== "en") {
        this.toastr.warning('Only speech option is available for the input langauge',)
      }
    } else {
      this.to = $event.target.value;
    }
  }


  translate(text: any) {
    this.isLoading = true;
    this.translatedText = '';
    let url = `${ENV.API_HOST_URL}/translate`;
    this.service.post({ from: this.from, to: this.to, term: text.value }, url).subscribe(data => {
      this.translatedText = data.term;
      this.isLoading = false;
       this.searchImages()

    });

  }


  searchImages() {

    if (this.checked && this.inputText !== "" && this.translatedText!=="" ) {
      let urlImages = `${ENV.API_HOST_URL}/images`;
      this.service.post({ text: `${this.inputText} ${this.translatedText}` }, urlImages).subscribe(images => {
        console.log('images', images)
        this.images = images
      })
    }
  }

  clearInputs() {
    this.inputText = '';
    this.translatedText = '';
    this.text = '';
    this.isShowStop = false;
    this.isShowMic = true;
  }
  swap(from: any, to: any, inputText: any, translatedText: any) {
    this.from = to;
    this.to = from;
    this.translatedText = inputText;
    this.inputText = translatedText;
    this.init(this.from)
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

  doAction(event: any) {
    this.images = [];
    console.log(event.target.checked)
    this.checked = event.target.checked;
    this.searchImages()
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
  changeIsShow(category: any) {
    for (let phrase of this.mostPopularPharses) {
      if (phrase.categeory == category) {
        phrase.isShow = true
      } else {
        phrase.isShow = false;
      }
    }

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
          this.isLoading = true;
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

  translateQuestion(question: any) {
    this.from = 'en';
    this.inputText = question;
    this.translate({ value: question });
  }

}
