import { Component, OnInit } from '@angular/core';
import { ConfigurationSettingsService } from '../../../../services/configuration/configuration-settings.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html'
})
export class ConfigurationComponent implements OnInit {

  public configurationSettings = []

  constructor(private configurationSettingsService: ConfigurationSettingsService,
              private toastr: ToastrService,
              private router: Router,
              private spinnerService: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.spinnerService.show('configurationSpinner')
    this.configurationSettingsService.getConfigurationSettings()
      .pipe(finalize(() => {
        this.spinnerService.hide('configurationSpinner')
      }))
      .subscribe(res => {
        this.configurationSettings = res.data
      }, () => {
        this.toastr.error('Hubo un error obteniendo configuracion.')
        this.router.navigateByUrl('/');
      })
  }

  public saveConfigurationSettings() {
    this.spinnerService.show('configurationSpinner')
    this.configurationSettingsService.putConfigurationSettings(this.configurationSettings)
      .pipe(finalize(() => {
        this.spinnerService.hide('configurationSpinner')
      }))
      .subscribe(() => {
        this.toastr.success('Configuracion guardada exitosamente.')
      }, () => {
        this.toastr.error('Hubo un error guardando la configuracion.')
      })
  }

}
