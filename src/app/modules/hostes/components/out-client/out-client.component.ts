import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {ClientService} from '../../../../services/client/client.service';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-out-client',
  templateUrl: './out-client.component.html'
})
export class OutClientComponent implements OnInit {
  public outClientForm: UntypedFormGroup;
  public loadingOutClientForm = false
  public docTypesList = [
    {itemId: 'CC', itemLabel: 'Cedula de ciudadania'},
    {itemId: 'CE', itemLabel: 'Cedula de extranjeria'},
    {itemId: 'PP', itemLabel: 'Pasaporte'},
  ];
  private reserveValue$: Subscription = new Subscription();

  constructor(private formBuilder: UntypedFormBuilder,
              private spinnerService: NgxSpinnerService,
              private toastr: ToastrService,
              private clientService: ClientService,
              private router: Router,
              private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit(): void {
    this.populateForm()
  }

  private createForm(): void {
    this.outClientForm = this.formBuilder.group({
      id: new UntypedFormControl(null),
      name: new UntypedFormControl(null, Validators.required),
      lastName: new UntypedFormControl(null, Validators.required),
      documentType: new UntypedFormControl(null),
      attemptSell: new UntypedFormControl(null),
      creditDenied: new UntypedFormControl(null),
      reserve: new UntypedFormControl(null),
      reserveValue: new UntypedFormControl(null),
      documentNumber: new UntypedFormControl(null),
      observations: new UntypedFormControl(null),
      voucher: new UntypedFormControl(null)
    });
    this.reserveValue$ = this.outClientForm.get('reserveValue').valueChanges.subscribe(value => {
      if (typeof value === 'string' || value instanceof String) {
        const num = Number(value.replace(/[^0-9.]+/g, ''));
        this.outClientForm.get('reserveValue').setValue(num, {emitEvent: false, emitViewToModelChange: false});
      }
    });
  }

  private populateForm() {
    const clientId = this.route.snapshot.params.clientId;
    if (clientId) {
      this.loadingOutClientForm = true;
      this.spinnerService.show('outClientSpinner')
      this.clientService.get(clientId)
        .pipe(finalize(() => {
          this.loadingOutClientForm = false;
          this.spinnerService.hide('outClientSpinner')
        }))
        .subscribe(res => {
          const client = res.data;
          const clientFormValue = {
            id: client.id,
            name: client.name,
            lastName: client.lastName,
            documentType: client.documentType || null,
            documentNumber: client.documentNumber || null,
            observations: null,
            voucher: null
          }
          this.outClientForm.patchValue(clientFormValue)
        })
    }
  }

  public onReserveChange() {
    const reserveControl = this.outClientForm.get('reserve')
    const reserveValueControl = this.outClientForm.get('reserveValue')
    if (reserveControl.value) {
      reserveValueControl.setValidators(Validators.required)
    } else {
      reserveValueControl.setValidators(null)
    }
    reserveValueControl.setValue(null, {emitEvent: false, emitViewToModelChange: false})
    reserveValueControl.updateValueAndValidity()
  }

  public updateClient() {
    this.loadingOutClientForm = true
    this.spinnerService.show('outClientSpinner')
    const clientUpdate = this.outClientForm.value
    this.clientService.putOutClient(clientUpdate)
      .pipe(finalize(() => {
        this.loadingOutClientForm = false
        this.spinnerService.hide('outClientSpinner')
      })).subscribe(() => {
      this.toastr.success('Salida de cliente exitosa')
      this.router.navigateByUrl('/')
    }, () => this.toastr.error('Hubo un error en la salida del cliente, por favor intente de nuevo'))
  }
}
