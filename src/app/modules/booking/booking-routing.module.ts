import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GenericSearchComponent} from '../shared/components/generic-search/generic-search.component';
import {BookingComponent} from './components/booking.component';
import {ContractDetailComponent} from './components/contract-detail/contract-detail.component';

const routes: Routes = [
  {
    path: '', component: BookingComponent,
    children:
      [
        {
          path: '', redirectTo: 'search-contract-booking'
        },
        {
          path: 'search-contract-booking', component: GenericSearchComponent
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
export class BookingRoutingModule {
}
