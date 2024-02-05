import { Component, HostListener, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthenticationService } from './services/auth/authentication.service';
import { Router } from '@angular/router';
import { ConfigurationSettingsService } from './services/configuration/configuration-settings.service';
import packageJson from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  userActivity: any;
  userInactive: Subject<any> = new Subject();

  constructor(@Inject('environment') private environment,
              private configurationSettingsService: ConfigurationSettingsService,
              private authService: AuthenticationService,
              private router: Router) {
    if (this.environment.production) {
      this.initVersionCheck();
    }
    this.setInactivityTimeout();
    this.userInactive.subscribe(() => {
      this.authService.logout();
      this.router.navigateByUrl('/login')
    });
  }

  private setInactivityTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(), 1800000);
  }

  public initVersionCheck(frequency = 900000) {
    setInterval(() => {
      this.checkVersion();
    }, frequency);
    this.checkVersion();
  }

  private checkVersion() {
    console.log('checking version...')
    this.configurationSettingsService.queryConfigurationSettings('appVersion')
      .subscribe(
        (res: any) => {

          const version = res.data.value
          if (packageJson.version !== version) {
            window.location.reload();
          }
        },
        (err) => {
          console.error(err, 'Could not get version');
        }
      );
  }

  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setInactivityTimeout();
  }
}
