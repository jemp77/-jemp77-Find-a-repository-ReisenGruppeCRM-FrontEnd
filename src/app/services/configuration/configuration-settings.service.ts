import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationSettingsService {
  private apiHost = this.environment.apiHost;
  private apiPath = this.environment.apiPath;

  constructor(private http: HttpClient, @Inject('environment') private environment) {
  }

  public getConfigurationSettings(): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/configurationSettings`;
    return this.http.get(url);
  }

  public queryConfigurationSettings(settingKey): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/configurationSettings/${settingKey}`;
    return this.http.get(url);
  }

  public putConfigurationSettings(configurationSettings): Observable<any> {
    const url = `${this.apiHost}/${this.apiPath}/configurationSettings/postUpdateConfigurations`;
    return this.http.post(url, configurationSettings);
  }
}
