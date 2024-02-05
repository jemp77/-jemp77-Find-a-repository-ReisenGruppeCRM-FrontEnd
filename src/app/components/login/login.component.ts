import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {AuthenticationService} from '../../services/auth/authentication.service';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: UntypedFormGroup;
  public loadingLogin = false;

  constructor(private authService: AuthenticationService,
              private formBuilder: UntypedFormBuilder,
              private toastr: ToastrService,
              private spinnerService: NgxSpinnerService,
              private router: Router) {
    this.createForm();
  }

  ngOnInit(): void {
    if (this.authService.getCurrentUser()) {
      this.router.navigateByUrl('/');
    }
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: new UntypedFormControl(null, Validators.required),
      password: new UntypedFormControl(null, Validators.required)
    });
  }

  public login() {
    this.loadingLogin = true
    const credentials = this.loginForm.value
    this.loginForm.disable();
    this.spinnerService.show('loginSpinner')
    this.authService.login(credentials)
      .pipe(finalize(() => {
        this.loginForm.enable();
        this.loadingLogin = false
        this.spinnerService.hide('loginSpinner')
      }))
      .subscribe(res => {
          const userData = res.data;
          this.authService.setCurrentUser(userData);
          this.router.navigateByUrl('/');
        },
        (httpErr) => {
          if (httpErr.status === 404) {
            this.toastr.error('Usuario o contraseña incorrectos');
            return
          }
          this.toastr.error('Hubo un error en el login, por favor intente de nuevo');
        });
  }
}
