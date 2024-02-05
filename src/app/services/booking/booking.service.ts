import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiHost = this.environment.apiHost;
  private apiPath = this.environment.apiPath;

  constructor(private http: HttpClient, @Inject('environment') private environment) {
  }

  public getContractBookings(contractId: number): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/booking/getContractBookings/${contractId}`;
    return this.http.get(url);
  }


  public post(booking: any): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/booking`;
    return this.http.post(url, booking);
  }

  public updateBookingObservation(id: number, observationObj: any) {
    const url = `${this.apiHost}/${this.apiPath}/booking/PutUpdateBookingObservation/${id}`;
    return this.http.put(url, observationObj);
  }

  public downloadFile(id: number): void {
    window.open(`${this.apiHost}/${this.apiPath}/booking/GetObservationFile/${id}`, '_blank');
  }
}
