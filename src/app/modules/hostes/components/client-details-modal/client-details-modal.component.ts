import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { ClientService } from '../../../../services/client/client.service';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../../../services/common/common.service';
import { forkJoin } from 'rxjs';
import { ConfigurationSettingsService } from '../../../../services/configuration/configuration-settings.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-details-modal',
  templateUrl: './client-details-modal.component.html',
  styleUrls: ['./client-details-modal.component.scss'],
  providers: [DatePipe]
})
export class ClientDetailsModalComponent {
  private clientId = null;
  public client: any = {};
  public selectedLinner;
  public selectedCloser;
  public tlmkCode;
  public linnerList = [];
  public closerList = [];
  public loadingClientDetails = false;
  @ViewChild('clientDetailsModal', {static: true}) modalTemplate: TemplateRef<any>;

  constructor(private modalService: NgbModal,
              private spinnerService: NgxSpinnerService,
              private clientService: ClientService,
              private configurationSettingsService: ConfigurationSettingsService,
              private datePipe: DatePipe,
              private toastr: ToastrService,
              private router: Router,
              public commonService: CommonService) {
  }

  public open(clientId) {
    this.clientId = clientId
    this.loadingClientDetails = true;
    this.spinnerService.show('clientDetailSpinner')
    const serviceCalls = [
      this.clientService.get(this.clientId),
      this.configurationSettingsService.queryConfigurationSettings('LinnerList'),
      this.configurationSettingsService.queryConfigurationSettings('CloserList')
    ]

    forkJoin(serviceCalls)
      .pipe(finalize(() => {
        this.loadingClientDetails = false;
        this.spinnerService.hide('clientDetailSpinner')
      })).subscribe(responses => {
      const client = responses[0].data;
      client.date = this.datePipe.transform(client.date, 'yyyy-MM-dd')
      this.client = client;
      this.linnerList = (responses[1].data.value).split(',');
      this.selectedLinner = client.linner;
      this.closerList = (responses[2].data.value).split(',');
      this.selectedCloser = client.closer;
      this.tlmkCode = client.tlmkCode;
    }, () => {
      this.toastr.error('Error al cargar confidencial')
      this.router.navigateByUrl('/');
    })
    this.modalService.open(this.modalTemplate, {size: 'xl'}).result.then(() => {
    }, (reason) => {
      switch (reason) {
        case 'saveChanges':
          const partialClient = {
            id: this.clientId,
            linner: this.selectedLinner,
            closer: this.selectedCloser,
            tlmkCode: this.tlmkCode
          }
          this.clientService.putEditConfidential(partialClient).subscribe(() => {
            this.toastr.success('Cliente editado de manera exitosa.')
            this.router.navigateByUrl(`/`)
          }, () => this.toastr.error('Hubo un error editando el cliente, por favor intente de nuevo'))
          break;
        default:
          break;
      }
    });
  }

  public saveChanges() {
    this.modalService.dismissAll('saveChanges')
  }
}
