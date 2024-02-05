import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BookingRoutingModule} from './booking-routing.module';
import {BookingComponent} from './components/booking.component';
import { ContractDetailComponent } from './components/contract-detail/contract-detail.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [BookingComponent, ContractDetailComponent],
  imports: [
    CommonModule,
    BookingRoutingModule,
    NgxSpinnerModule,
    NgbModule,
    FormsModule,
    FontAwesomeModule,
    SharedModule
  ]
})
export class BookingModule {
}
