import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from '../../../../services/client/client.service';
import { ToastrService } from 'ngx-toastr';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { Router } from '@angular/router';
import { genericSearchConfig } from './generic-search.config';
import { ContractService } from '../../../../services/contract/contract.service';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { SimpleOptionsModalComponent } from '../simple-options-modal/simple-options-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { CommonService } from '../../../../services/common/common.service';

@Component({
  selector: 'app-generic-search',
  templateUrl: './generic-search.component.html',
  styleUrls: ['./generic-search.component.scss'],
})
export class GenericSearchComponent implements OnInit {

  @ViewChild('cancelContractOptionsModal') cancelContractOptionsModal: SimpleOptionsModalComponent
  // client Actions
  public clientDetailsIcon = faEye;
  public outClientIcon = faSignOutAlt;
  public editClientIcon = faEdit;
  // new contract Actions
  public generateContractIcon = faFileAlt;
  // contract Actions
  public downloadContractIcon = faDownload;
  public editContractIcon = faEdit;
  public cancelContractIcon = faTimes;
  // booking/customerService contract Actions
  public contractDetailIcon = faEye;
  public loadingSearch = false;
  public cancelContractModalModel = {
    title: 'Cancelar Contrato',
    description: 'Seguro desea cancelar este contrato?',
  }
  public searchText = null
  public searchResults = [];
  public searchType = this.getSearchType();
  public resultsColumns = genericSearchConfig(this.searchType)

  constructor(private clientService: ClientService,
              private contractService: ContractService,
              private spinnerService: NgxSpinnerService,
              private router: Router,
              private toastr: ToastrService,
              public commonService: CommonService) {
  }

  ngOnInit(): void {
  }

  private getSearchType(): string {
    const urlSplit = this.router.url.split('/');
    return urlSplit[urlSplit.length - 1]
  }

  public onSearchInputKeyUp(event) {
    const keyCode = event.code
    if ((keyCode === 'Enter') || keyCode === 'NumpadEnter') {
      this.sendSearch()
    }
  }

  public sendSearch() {
    if (this.searchText) {
      this.spinnerService.show('genericSearchSpinner')
      if (this.searchType === 'search-client' || this.searchType === 'search-new-contract') {
        this.sendClientSearch()
      }
      if (this.searchType === 'search-contract') {
        this.sendActiveContractsSearch()
      }
      if (this.searchType === 'search-contract-booking' || this.searchType === 'search-contract-customer-service') {
        this.sendAllContractsSearch()
      }
    }
  }

  private sendClientSearch() {
    this.clientService.search(this.searchText)
      .pipe(finalize(() => {
        this.spinnerService.hide('genericSearchSpinner')
      }))
      .subscribe(res => {
        this.fillResults(res)
      }, httpErr => {
        this.onSearchError(httpErr)
      })
  }

  private sendActiveContractsSearch() {
    this.contractService.searchActiveContracts(this.searchText)
      .pipe(finalize(() => {
        this.spinnerService.hide('genericSearchSpinner')
      }))
      .subscribe(res => {
        this.fillResults(res)
      }, httpErr => {
        this.onSearchError(httpErr)
      })
  }

  private sendAllContractsSearch() {
    this.contractService.searchAllContracts(this.searchText)
      .pipe(finalize(() => {
        this.spinnerService.hide('genericSearchSpinner')
      }))
      .subscribe(res => {
        this.fillResults(res)
      }, httpErr => {
        this.onSearchError(httpErr)
      })
  }

  private fillResults(httpResponse) {
    this.searchResults = httpResponse.data.items
    if (this.searchResults.length === 0) {
      this.toastr.info('No se encontraron coincidencias')
    }
  }

  private onSearchError(httpError) {
    this.searchResults = []
    if (httpError.status === 404) {
      this.toastr.error('No se encontraron datos.');
      return
    }
    this.toastr.error('Hubo un error en la busqueda, por favor intente de nuevo.')
  }

  public outClient(client) {
    this.router.navigateByUrl(`/hostes/out-client/${client.id}`)
  }

  public editClient(client) {
    this.router.navigateByUrl(`/hostes/edit-client/${client.id}`)
  }

  public clientDetails(client) {
    this.router.navigateByUrl(`/hostes/client-detail/${client.id}`)
  }

  public generateContract(client) {
    this.router.navigateByUrl(`/hostes/generate-contract/${client.id}`)
  }

  public downloadContract(contract) {
    this.contractService.downloadContractReport(contract.id)
  }

  public editContract(contract) {
    this.router.navigateByUrl(`/hostes/edit-contract/${contract.id}`)
  }

  public cancelContract(contract) {
    this.cancelContractOptionsModal.open(contract)
  }

  public contractDetail(contract) {
    if (this.searchType === 'search-contract') {
      this.router.navigateByUrl(`/hostes/contract-detail/${contract.id}`)
    }
    if (this.searchType === 'search-contract-booking') {
      this.router.navigateByUrl(`/booking/contract-detail/${contract.id}`)
    }
    if (this.searchType === 'search-contract-customer-service') {
      this.router.navigateByUrl(`/customer-service/contract-detail/${contract.id}`)
    }
  }

  public onCancelContractAccepted(contract) {
    if (contract) {
      this.contractService.cancelContract(contract.id).subscribe(() => {
        this.toastr.success('Contrato cancelado exitosamente')
        this.sendSearch()
      }, () => {
        this.toastr.error('Hubo un error cancelando el contrato, por favor intente de nuevo.')
      })
    }
  }
}
