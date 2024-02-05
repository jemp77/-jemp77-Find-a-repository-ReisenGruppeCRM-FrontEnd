import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private apiHost = this.environment.apiHost;
  private apiPath = this.environment.apiPath;

  constructor(private http: HttpClient,
              @Inject('environment') private environment) {
  }

  public getCardsAndBanks(): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/client/getCardsAndBanks`;
    return this.http.get(url);
  }

  public isAllowed(allowedScopes: string[]): boolean {
    const user = JSON.parse(localStorage.getItem('SMARTCART.currentUser'));
    if (!user) {
      return false;
    }
    const {role} = user
    let isAllowed = false
    const {scopes} = role;
    if (scopes.includes('*') || allowedScopes.includes('CanLogOut')) {
      return true;
    }
    allowedScopes.forEach(as => {
      if (scopes.includes(as)) {
        isAllowed = true;
      }
    })
    return isAllowed
  }
}
