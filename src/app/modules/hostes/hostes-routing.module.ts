import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HostesComponent } from './components/hostes.component';
import { CreateClientComponent } from './components/create-client/create-client.component';
import { OutClientComponent } from './components/out-client/out-client.component';
import { GenericSearchComponent } from '../shared/components/generic-search/generic-search.component';
import { GenerateContractComponent } from './components/generate-contract/generate-contract.component';

const routes: Routes = [
  {
    path: '', component: HostesComponent,
    children:
      [
        {
          path: '', redirectTo: 'create-client'
        },
        {
          path: 'create-client', component: CreateClientComponent
        },
        {
          path: 'edit-client/:clientId', component: CreateClientComponent
        },
        {
          path: 'client-detail/:clientId', component: CreateClientComponent
        },
        {
          path: 'out-client/:clientId', component: OutClientComponent
        },
        {
          path: 'search-client', component: GenericSearchComponent
        },
        {
          path: 'search-new-contract', component: GenericSearchComponent
        },
        {
          path: 'search-contract', component: GenericSearchComponent
        },
        {
          path: 'generate-contract/:clientId', component: GenerateContractComponent
        },
        {
          path: 'edit-contract/:contractId', component: GenerateContractComponent
        },
        {
          path: 'contract-detail/:contractId', component: GenerateContractComponent
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostesRoutingModule {
}
