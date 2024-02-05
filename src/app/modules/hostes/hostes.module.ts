import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostesRoutingModule } from './hostes-routing.module';
import { HostesComponent } from './components/hostes.component';
import { CreateClientComponent } from './components/create-client/create-client.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from '../shared/shared.module';
import { CreateClientOptionsModalComponent } from './components/create-client-options-modal/create-client-options-modal.component';
import { OutClientComponent } from './components/out-client/out-client.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GenerateContractComponent } from './components/generate-contract/generate-contract.component';
import { ClientDetailsModalComponent } from './components/client-details-modal/client-details-modal.component';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';


@NgModule({
  declarations: [
    HostesComponent,
    CreateClientComponent,
    CreateClientOptionsModalComponent,
    OutClientComponent,
    GenerateContractComponent,
    ClientDetailsModalComponent
  ],
  imports: [
    CommonModule,
    HostesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    NgMultiSelectDropDownModule,
    SharedModule,
    NgxSpinnerModule,
    AngularSignaturePadModule
  ],
  exports: [
    ClientDetailsModalComponent
  ]
})
export class HostesModule {
}
