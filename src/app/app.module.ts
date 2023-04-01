import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {  FormsModule } from '@angular/forms';
import {  HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { JadoreService } from './service/jadore.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslationComponent } from './translation/translation.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AboutComponent } from './about/about.component';
import { NeedHelpComponent } from './need-help/need-help.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    HomeComponent,
    TranslationComponent,
    AboutComponent,
    NeedHelpComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    PopoverModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbModule,
    NgbPaginationModule, NgbAlertModule, ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})

  ],
  providers: [
    JadoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
