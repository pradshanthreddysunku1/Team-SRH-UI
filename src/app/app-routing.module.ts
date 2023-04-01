import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { TranslationComponent } from './translation/translation.component';
import { AboutComponent } from './about/about.component';
import { NeedHelpComponent } from './need-help/need-help.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'translation', component: TranslationComponent },
  { path: 'about', component: AboutComponent },
  { path: 'need-help', component: NeedHelpComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: "bo", loadChildren: () => import('./bo/bo.module').then(m => m.BoModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
