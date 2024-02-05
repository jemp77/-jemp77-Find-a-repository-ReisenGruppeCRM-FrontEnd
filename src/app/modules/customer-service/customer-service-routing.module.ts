import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GenericSearchComponent} from '../shared/components/generic-search/generic-search.component';
import {CustomerServiceComponent} from './components/customer-service.component';
import {ContractDetailComponent} from './components/contract-detail/contract-detail.component';

const routes: Routes = [
  {
    path: '', component: CustomerServiceComponent,
    children:
      [
        {
          path: '', redirectTo: 'search-contract-customer-service'
        },
        {
          path: 'search-contract-customer-service', component: GenericSearchComponent
        },
        {
          path: 'contract-detail/:contractId', component: ContractDetailComponent
        },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerServiceRoutingModule {
}
