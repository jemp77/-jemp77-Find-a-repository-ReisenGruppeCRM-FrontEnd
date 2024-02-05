import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './components/admin.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ManifestComponent } from './components/manifest/manifest.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [AdminComponent, ConfigurationComponent, ManifestComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ]
})
export class AdminModule { }
