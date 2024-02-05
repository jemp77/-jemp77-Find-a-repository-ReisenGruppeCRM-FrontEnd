import { Component } from '@angular/core';
import { smartCardSidebar } from './config/sidebar.config';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent {
  public sidebarOptions = smartCardSidebar();
  public currentModule = '';
  public currentSubModule = '';

  constructor(private authService: AuthenticationService,
              private toastr: ToastrService,
              public commonService: CommonService,
              private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const urlSplited = event.url.split('/');
        this.currentModule = event.url.split('/')[1];
        if (urlSplited.length >= 3) {
          this.currentSubModule = event.url.split('/')[2];
        }
      }
    });
  }

  public validateSelection(option) {
    if (option.type === 'action') {
      this[option.action]();
      return
    }
    if (option.type === 'route') {
      this.router.navigateByUrl(option.route);
      return;
    }
  }

  public showToastr() {
    this.toastr.info('Estamos trabajando en este modulo :)')
  }

  public logOut() {
    this.authService.logout()
    this.router.navigateByUrl('/login')
  }
}
