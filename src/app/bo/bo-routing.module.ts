import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { BoTranslationComponent } from './bo-translation/bo-translation.component';
import { MyFeedbackComponent } from './my-feedback/my-feedback.component';

const routes: Routes = [
  { path: 'profile', component: ProfileComponent }, 
  { path: 'translation', component: BoTranslationComponent },
  { path: 'feedback', component: MyFeedbackComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoRoutingModule { }
