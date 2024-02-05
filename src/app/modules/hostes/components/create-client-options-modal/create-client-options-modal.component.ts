import {Component, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-client-options-modal',
  templateUrl: './create-client-options-modal.component.html'
})
export class CreateClientOptionsModalComponent {
  private clientId = null;
  @ViewChild('createClientOptionsModal', {static: true}) modalTemplate: TemplateRef<any>;

  constructor(private modalService: NgbModal,
              private router: Router) {
  }

  public open(clientId) {
    this.clientId = clientId
    this.modalService.open(this.modalTemplate).result.then(() => {
    }, (reason) => {
      switch (reason) {
        case 'outClient':
        case 'generateContract':
          break
        default:
          this.router.navigateByUrl(`/`)
      }
    });
  }

  public generateOutClient() {
    this.modalService.dismissAll('outClient')
    this.router.navigateByUrl(`/hostes/out-client/${this.clientId}`)
  }

  public generateContract() {
    this.modalService.dismissAll('generateContract')
    this.router.navigateByUrl(`/hostes/generate-contract/${this.clientId}`)
  }
}
