import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {ContractService} from '../../../../services/contract/contract.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {DatePipe} from '@angular/common';
import {forkJoin} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {faEdit} from '@fortawesome/free-solid-svg-icons/faEdit';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {CommonService} from '../../../../services/common/common.service';
import {CustomerServiceService} from '../../../../services/customer-service/customer-service.service';

enum contractStatus {
  null,
  generated,
  edited,
  canceled
}

@Component({
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.scss'],
  providers: [DatePipe]
})
export class ContractDetailComponent implements OnInit {
  public contractId = this.route.snapshot.params.contractId;
  public contract: any = null;
  public contractCustomerServices = [];
  public editObservationIcon = faEdit;
  public faTimes = faTimes;
  public activeTabId = 1;
  public maxCustomerServiceObservationDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
  public customerService = {
    contractId: Number(this.contractId),
    observationDate: this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm'),
    observations: '',
    customerServiceObservationFiles: []
  }

  constructor(private contractService: ContractService,
              private customerServiceService: CustomerServiceService,
              private spinnerService: NgxSpinnerService,
              private toastr: ToastrService,
              private datePipe: DatePipe,
              private route: ActivatedRoute,
              private router: Router,
              public commonService: CommonService) {
  }

  ngOnInit(): void {
    this.spinnerService.show('contractDetailSpinner')
    forkJoin([this.contractService.get(this.contractId),
      this.customerServiceService.getContractCustomerServices(this.contractId)])
      .pipe(finalize(() => {
        this.spinnerService.hide('contractDetailSpinner')
      })).subscribe(responses => {
      const contractResponse = responses[0];
      const bookingsResponse = responses[1];
      this.contract = contractResponse.data
      this.contract.status = contractStatus[this.contract.status]
      this.contractCustomerServices = bookingsResponse.data.items;
    }, () => {
      this.toastr.error('Error al cargar informacion')
      this.router.navigateByUrl('/booking');
    })
  }

  public handleUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.customerService.customerServiceObservationFiles.push({
        fileName: file.name,
        fileBase64: reader.result
      })
    };
  }

  public removeFile(file) {
    this.customerService.customerServiceObservationFiles =
      this.customerService.customerServiceObservationFiles.filter(f => f.fileName !== file.fileName)
  }

  public submitObservation() {
    this.spinnerService.show('contractDetailSpinner')
    this.customerServiceService.post(this.customerService).pipe(finalize(() => {
      this.spinnerService.hide('contractDetailSpinner')
    })).subscribe(() => {
      this.clearForm()
      this.updateObservationList()
      this.toastr.success('observacion agregada exitosamente')
    }, () => {
      this.toastr.error('hubo un error al agrerar la observacion')
    })
  }

  public downloadFile(file) {
    this.customerServiceService.downloadFile(file.id)
  }

  private clearForm() {
    this.maxCustomerServiceObservationDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm');
    this.customerService = {
      contractId: Number(this.contractId),
      observationDate: this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm'),
      observations: '',
      customerServiceObservationFiles: []
    }
  }

  private updateObservationList() {
    this.customerServiceService.getContractCustomerServices(this.contractId).subscribe(res => {
      this.contractCustomerServices = res.data.items;
    })
  }

  public toggleEditObservation(observation) {
    observation.isEditing = !observation.isEditing
  }

  public editObservation(observation) {
    const editObj = {observations: observation.observations}
    this.customerServiceService.updateCustomerServiceObservation(observation.id, editObj).subscribe(() => {
      this.toastr.success('observacion editada exitosamente')
      observation.isEditing = false;
    }, () => {
      this.toastr.error('hubo un error al editar la observacion')
      this.updateObservationList()
    })
  }
}
