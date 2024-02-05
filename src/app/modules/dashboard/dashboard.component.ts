import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { ClientService } from '../../services/client/client.service';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { Router } from '@angular/router';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { CommonService } from '../../services/common/common.service';
import { ClientDetailsModalComponent } from '../hostes/components/client-details-modal/client-details-modal.component';
import { DatePipe } from '@angular/common';


@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe]
})

export class DashboardComponent implements OnInit {

  @ViewChild('clientDetailsModalComponent') clientDetailsModalComponent: ClientDetailsModalComponent;
  public loggedUser;
  public dailyClients = [];
  public clientDetailsIcon = faEye;
  public infoIcon = faInfoCircle;
  public outClientIcon = faSignOutAlt;
  public editClientIcon = faEdit;
  public generateContractIcon = faFileAlt;
  public startDate;
  public endDate;
  public isDateRangeValid = true;

  constructor(private authService: AuthenticationService,
              private datePipe: DatePipe,
              private router: Router,
              private toastr: ToastrService,
              private spinnerService: NgxSpinnerService,
              private clientService: ClientService,
              public commonService: CommonService) {
    this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
  }

  ngOnInit() {
    this.loggedUser = this.authService.getCurrentUser();
    if (this.commonService.isAllowed(['HasHostessAccess'])) {
      this.loadClientsForDashboard()
    }
  }

  public loadClientsForDashboard() {
    this.spinnerService.show('dashboardSpinner');
    this.clientService.getClientsForDashboard(this.startDate, this.endDate)
      .pipe(finalize(() => this.spinnerService.hide('dashboardSpinner')))
      .subscribe(res => {
        this.dailyClients = res.data.items;
        this.dailyClients.forEach(c => c.expanded = false)
      }, () => {
        this.toastr.error('Hubo un error consultando los clientes del dia, por favor intente de nuevo.')
      })
  }

  public toggleClientExpanded(client) {
    const state = client.expanded;
    this.dailyClients.forEach(c => c.expanded = false)
    client.expanded = !state
  }

  public clientDetails(client) {
    this.clientDetailsModalComponent.open(client.id)
  }

  public outClient(client) {
    this.router.navigateByUrl(`/hostes/out-client/${client.id}`)
  }

  public editClient(client) {
    this.router.navigateByUrl(`/hostes/edit-client/${client.id}`)
  }

  public generateContract(client) {
    this.router.navigateByUrl(`/hostes/generate-contract/${client.id}`)
  }

  validateRange() {
    if (this.startDate && this.endDate) {
      this.isDateRangeValid = Date.parse(this.startDate) <= Date.parse(this.endDate);
    }
  }

  applyDateRangeFilter() {
    if (this.isDateRangeValid) {
      this.loadClientsForDashboard();
    }
  }
}
