import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from '../../modules/dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HostesModule } from '../../modules/hostes/hostes.module';
import { SharedModule } from '../../modules/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        MainLayoutRoutingModule,
        FormsModule,
        NgbModule,
        FontAwesomeModule,
        NgxSpinnerModule,
        HostesModule,
        SharedModule
    ],
  declarations: [
    DashboardComponent
  ]
})

export class MainLayoutModule {
}
