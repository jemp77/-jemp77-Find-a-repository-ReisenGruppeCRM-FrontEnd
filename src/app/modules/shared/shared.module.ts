import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InlineErrorComponent} from './components/inline-error/inline-error.component';
import { GenericSearchComponent } from './components/generic-search/generic-search.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import { SimpleOptionsModalComponent } from './components/simple-options-modal/simple-options-modal.component';
import { CelebrateComponent } from './components/celebrate/celebrate.component';


@NgModule({
  declarations: [InlineErrorComponent, GenericSearchComponent, SimpleOptionsModalComponent, CelebrateComponent],
  exports: [
    InlineErrorComponent,
    SimpleOptionsModalComponent,
    CelebrateComponent
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    FormsModule,
    FontAwesomeModule,
    NgbTooltipModule
  ]
})
export class SharedModule {
}
