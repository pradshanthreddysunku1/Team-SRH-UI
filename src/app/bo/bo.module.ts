import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, } from '@angular/forms';
import { BoRoutingModule } from './bo-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { JadoreService } from '../service/jadore.service';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { BoTranslationComponent } from './bo-translation/bo-translation.component';
import { MyFeedbackComponent } from './my-feedback/my-feedback.component';
import { MyHistoryComponent } from './my-history/my-history.component';
@NgModule({
  declarations: [
    ProfileComponent,
    BoTranslationComponent,
    MyFeedbackComponent,
    MyHistoryComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    BoRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    PopoverModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbPaginationModule, NgbAlertModule

  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    JadoreService
  ],
})
export class BoModule { }
