import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private apiHost = this.environment.apiHost;
  private apiPath = this.environment.apiPath;

  constructor(private http: HttpClient, @Inject('environment') private environment) {
  }

  public get(id: number): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/contract/${id}`;
    return this.http.get(url);
  }

  public getContractNumber(): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/contract/getContractNumber`;
    return this.http.get(url);
  }

  public downloadContractReport(id: number): void {
    window.open(`${this.apiHost}/${this.apiPath}/contract/getContractReport/${id}`, '_blank');
  }

  public getManifestReport(startDate, endDate): void {
    window.open(`${this.apiHost}/${this.apiPath}/contract/getManifestReport/${startDate}/${endDate}`, '_blank');
  }

  public post(contract: any): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/contract`;
    return this.http.post(url, contract);
  }

  public put(contract: any): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/contract/${contract.id}`;
    return this.http.put(url, contract);
  }

  public cancelContract(id: any): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/contract/putCancelContract/${id}`;
    return this.http.put(url, {});
  }

  public searchActiveContracts(query: string): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/contract/getActiveContractsByFilters/${query}`;
    return this.http.get(url);
  }

  public searchAllContracts(query: string): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/contract/GetAllContractsByFilters/${query}`;
    return this.http.get(url);
  }
}
