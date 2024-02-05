import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-simple-options-modal',
  templateUrl: './simple-options-modal.component.html',
  styleUrls: ['./simple-options-modal.component.scss']
})
export class SimpleOptionsModalComponent {

  @ViewChild('simpleOptionsModal', {static: true}) modalTemplate: TemplateRef<any>;
  @Input() modalModel: {
    title: string,
    description: string,
    acceptLabel?: string,
    cancelLabel?: string
  }
  @Output() accepted = new EventEmitter<any>()
  @Output() canceled = new EventEmitter<any>()
  @Output() dismissed = new EventEmitter<any>()
  private data: any = null

  constructor(private modalService: NgbModal) {
  }

  public open(data?) {
    if (data) {
      this.data = data
    }
    this.modalService.open(this.modalTemplate).result.then(() => {
      this.dismissed.emit(this.data)
    }, () => {
      this.dismissed.emit(this.data)
    });
  }

  public accept() {
    this.modalService.dismissAll()
    this.accepted.emit(this.data)
  }

  public cancel() {
    this.modalService.dismissAll()
    this.canceled.emit(this.data)
  }
}
