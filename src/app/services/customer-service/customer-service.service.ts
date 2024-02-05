import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {
  private apiHost = this.environment.apiHost;
  private apiPath = this.environment.apiPath;

  constructor(private http: HttpClient, @Inject('environment') private environment) {
  }

  public getContractCustomerServices(contractId: number): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/customerService/getContractCustomerServices/${contractId}`;
    return this.http.get(url);
  }


  public post(customerService: any): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/customerService`;
    return this.http.post(url, customerService);
  }

  public updateCustomerServiceObservation(id: number, observationObj: any) {
    const url = `${this.apiHost}/${this.apiPath}/customerService/PutUpdateCustomerServiceObservation/${id}`;
    return this.http.put(url, observationObj);
  }

  public downloadFile(id: number): void {
    window.open(`${this.apiHost}/${this.apiPath}/customerService/GetObservationFile/${id}`, '_blank');
  }
}
