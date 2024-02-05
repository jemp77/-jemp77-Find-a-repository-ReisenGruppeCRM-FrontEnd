import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuoterService {
  private apiHost = this.environment.apiHost;
  private apiPath = this.environment.apiPath;

  constructor(private http: HttpClient, @Inject('environment') private environment) {
  }
  public post(quotation: any): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/Quoter/SendQuote`;
    return this.http.post(url, quotation);
  }
  public getLandingAssets(): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/Quoter/LandingAndAssets`;
    return this.http.get(url);
  }
}

