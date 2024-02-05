import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerServiceRoutingModule} from './customer-service-routing.module';
import {CustomerServiceComponent} from './components/customer-service.component';
import {ContractDetailComponent} from './components/contract-detail/contract-detail.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [CustomerServiceComponent, ContractDetailComponent],
  imports: [
    CommonModule,
    CustomerServiceRoutingModule,
    NgxSpinnerModule,
    NgbModule,
    FormsModule,
    FontAwesomeModule
  ]
})
export class CustomerServiceModule {
}
