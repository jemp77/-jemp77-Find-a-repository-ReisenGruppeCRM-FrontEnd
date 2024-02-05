import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiHost = this.environment.apiHost;
  private apiPath = this.environment.apiPath;

  constructor(private http: HttpClient, @Inject('environment') private environment) {
  }

  public get(id: number): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/Client/${id}`;
    return this.http.get(url);
  }

  public getClientsForDashboard(startDate, endDate): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/Client/GetClientsForDashboard/${startDate}/${endDate}`;
    return this.http.get(url);
  }

  public post(client: any): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/Client`;
    return this.http.post(url, client);
  }

  public put(client: any): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/Client/${client.id}`;
    return this.http.put(url, client);
  }

  public putOutClient(client: any): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/Client/putOutClient/${client.id}`;
    return this.http.put(url, client);
  }

  public putEditConfidential(partialClient: any): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/Client/putEditConfidential/${partialClient.id}`;
    return this.http.put(url, partialClient);
  }

  public search(query: string): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/Client/GetClientByFilters/${query}`;
    return this.http.get(url);
  }

  public sendWelcomeMail(client) {
    const url = `${this.apiHost}/${this.apiPath}/Client/PostSendWelcomeEmail/${client.id}`;
    return this.http.post(url, {});
  }
}
