import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-inline-error',
  templateUrl: './inline-error.component.html',
  styleUrls: ['./inline-error.component.scss']
})
export class InlineErrorComponent {
  @Input() error: any;

  constructor() {
  }

}
