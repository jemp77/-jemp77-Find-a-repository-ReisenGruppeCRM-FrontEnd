import {Inject, Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiHost = this.environment.apiHost;
  private apiPath = this.environment.apiPath;

  constructor(private http: HttpClient, @Inject('environment') private environment) {
  }

  public login(credentials): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/User/login`;
    return this.http.post(url, credentials);
  }

  public logout(): void {
    this.setCurrentUser(null);
  }

  setCurrentUser(userData) {
    if (userData) {
      localStorage.setItem('SMARTCART.currentUser', JSON.stringify(userData));
    } else {
      localStorage.removeItem('SMARTCART.currentUser');
    }
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('SMARTCART.currentUser'));
  }

}
