import { Component } from '@angular/core';
import { ContractService } from '../../../../services/contract/contract.service';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: './manifest.component.html',
  providers: [DatePipe]
})
export class ManifestComponent {
  public startDate;
  public endDate;
  public isDateRangeValid = true;

  constructor(private contractService: ContractService,
              private datePipe: DatePipe) {
    this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    this.endDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
  }

  public generateManifest() {
    this.contractService.getManifestReport(this.startDate, this.endDate)
  }

  validateRange() {
    if (this.startDate && this.endDate) {
      this.isDateRangeValid = Date.parse(this.startDate) <= Date.parse(this.endDate);
    }
  }

  applyDateRangeFilter() {
    if (this.isDateRangeValid) {
      this.generateManifest();
    }
  }
}
