import { Component, OnDestroy, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ClientService } from '../../../../services/client/client.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { forkJoin, Subscription } from 'rxjs';
import { CreateClientOptionsModalComponent } from '../create-client-options-modal/create-client-options-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../../services/common/common.service';
import { ConfigurationSettingsService } from '../../../../services/configuration/configuration-settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSignaturePadOptions, SignaturePadComponent } from '@almothafar/angular-signature-pad';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss'],
  providers: [DatePipe]
})
export class CreateClientComponent implements OnDestroy {
  @ViewChild('createClientOptionsModalComponent') createClientOptionsModal: CreateClientOptionsModalComponent
  @ViewChild('clientSignaturePadComponent') clientSignaturePad: SignaturePadComponent;
  public clientId = this.route.snapshot.params.clientId;
  public createClientForm: UntypedFormGroup;
  public loadingCreateClientForm = false;
  public clientSignatureModified = false;
  private monthlyIncome$: Subscription = new Subscription();
  private coOwnerMonthlyIncome$: Subscription = new Subscription();
  public signatureConfig: NgSignaturePadOptions = {
    canvasWidth: 550,
    canvasHeight: 200
  };
  public genresList = [
    { itemId: 'Hombre', itemLabel: 'Hombre' },
    { itemId: 'Mujer', itemLabel: 'Mujer' },
  ];
  public docTypesList = [
    { itemId: 'CC', itemLabel: 'Cedula de ciudadania' },
    { itemId: 'CE', itemLabel: 'Cedula de extranjeria' },
    { itemId: 'PP', itemLabel: 'Pasaporte' },
  ];
  public housingTypesList = [
    { itemId: 'Propia', itemLabel: 'Propia' },
    { itemId: 'Arrendada', itemLabel: 'Arrendada' },
    { itemId: 'Familiar', itemLabel: 'Familiar' },
  ];
  public creditCardsDropdownList = [];
  public debitCardsDropdownList = [];
  public banksDropdownList = [];
  public linnerList = [];
  public closerList = [];

  constructor(private clientService: ClientService,
              private commonService: CommonService,
              private configurationSettingsService: ConfigurationSettingsService,
              private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrService,
              private datePipe: DatePipe,
              private formBuilder: UntypedFormBuilder,
              private spinnerService: NgxSpinnerService) {
    this.createForm();
    this.loadCardsAndBanks();
  }

  ngOnDestroy() {
    this.monthlyIncome$.unsubscribe();
    this.coOwnerMonthlyIncome$.unsubscribe()
  }


  private createForm(): void {
    this.createClientForm = this.formBuilder.group({
      date: new UntypedFormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
      arrivalTime: new UntypedFormControl(new Date().toString().split(' ')[4]),
      tableNumber: new UntypedFormControl(null),
      linner: new UntypedFormControl(null),
      closer: new UntypedFormControl(null),
      tlmkCode: new UntypedFormControl(null),
      name: new UntypedFormControl(null, Validators.required),
      lastName: new UntypedFormControl(null, Validators.required),
      gender: new UntypedFormControl(null),
      age: new UntypedFormControl(null),
      profession: new UntypedFormControl(null),
      documentType: new UntypedFormControl(null),
      documentNumber: new UntypedFormControl(null),
      phoneNumber: new UntypedFormControl(null),
      email: new UntypedFormControl(null, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')),
      monthlyIncome: new UntypedFormControl(null, [Validators.pattern('^[0-9]*$')]),
      hasWorkedWithTourismIndustry: new UntypedFormControl(null),
      tourismIndustry: new UntypedFormControl(null),
      maritalStatus: new UntypedFormControl(null),
      sons: new UntypedFormControl(null),
      housingType: new UntypedFormControl(null),
      neighborhood: new UntypedFormControl(null),
      debitCreditBanks: new UntypedFormControl(null),
      coOwnerName: new UntypedFormControl(null),
      coOwnerLastName: new UntypedFormControl(null),
      coOwnerGender: new UntypedFormControl(null),
      coOwnerAge: new UntypedFormControl(null),
      coOwnerProfession: new UntypedFormControl(null),
      coOwnerDocumentType: new UntypedFormControl(null),
      coOwnerDocumentNumber: new UntypedFormControl(null),
      coOwnerPhoneNumber: new UntypedFormControl(null),
      coOwnerEmail: new UntypedFormControl(null, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')),
      coOwnerMonthlyIncome: new UntypedFormControl(null, [Validators.pattern('^[0-9]*$')]),
      coOwnerHasWorkedWithTourismIndustry: new UntypedFormControl(null),
      coOwnerTourismIndustry: new UntypedFormControl(null),
      coOwnerDebitCreditBanks: new UntypedFormControl(null),
      hasCar: new UntypedFormControl(null),
      carBrandModel: new UntypedFormControl(null),
      clientDebitCreditCards: this.formBuilder.array([this.createCard()]),
      coOwnerDebitCreditCards: this.formBuilder.array([this.createCard()])
    });
    this.monthlyIncome$ = this.createClientForm.get('monthlyIncome').valueChanges.subscribe(value => {
      if (typeof value === 'string' || value instanceof String) {
        const num = Number(value.replace(/[^0-9.]+/g, ''));
        this.createClientForm.get('monthlyIncome').setValue(num, { emitEvent: false, emitViewToModelChange: false });
      }
    });
    this.coOwnerMonthlyIncome$ = this.createClientForm.get('coOwnerMonthlyIncome').valueChanges.subscribe(value => {
      if (typeof value === 'string' || value instanceof String) {
        const num = Number(value.replace(/[^0-9.]+/g, ''));
        this.createClientForm.get('coOwnerMonthlyIncome').setValue(num, { emitEvent: false, emitViewToModelChange: false });
      }
    });
    if (this.clientId) {
      this.populateForm()
    }
  }

  private populateForm() {
    this.loadingCreateClientForm = true;
    this.spinnerService.show('createClientSpinner')
    this.clientService.get(this.clientId).pipe(finalize(() => {
        this.loadingCreateClientForm = false;
        this.spinnerService.hide('createClientSpinner')
      })
    ).subscribe(res => {
      const client = res.data
      client.date = this.datePipe.transform(client.date, 'yyyy-MM-dd')
      this.clientSignaturePad.fromDataURL(client.signature,
        {
          width: this.signatureConfig.canvasWidth,
          height: this.signatureConfig.canvasHeight,
        })
      if (!client.signature) {
        this.clearSignature();
      }
      this.createClientForm.patchValue(client)
      if (client.clientDebitCreditCards && client.clientDebitCreditCards.length > 0) {
        this.removeClientCard(0)
        const clientCards = this.createClientForm.get('clientDebitCreditCards') as UntypedFormArray;
        client.clientDebitCreditCards.forEach(cc => {
          clientCards.push(this.createCard(cc));
        })
      }
      if (client.coOwnerDebitCreditCards && client.coOwnerDebitCreditCards.length > 0) {
        this.removeCoOwnerCard(0)
        const coOwnerCards = this.createClientForm.get('coOwnerDebitCreditCards') as UntypedFormArray;
        client.coOwnerDebitCreditCards.forEach(coc => {
          coOwnerCards.push(this.createCard(coc));
        })
      }
      if (this.router.url.includes('/client-detail/')) {
        this.createClientForm.disable({ emitEvent: false });
      }
    })
  }

  private loadCardsAndBanks() {
    this.spinnerService.show('createClientSpinner')
    this.loadingCreateClientForm = true
    forkJoin([this.commonService.getCardsAndBanks(),
      this.configurationSettingsService.queryConfigurationSettings('LinnerList'),
      this.configurationSettingsService.queryConfigurationSettings('CloserList')])
      .pipe(finalize(() => {
        this.loadingCreateClientForm = false;
        this.spinnerService.hide('createClientSpinner')
      })).subscribe(responses => {
      const cardsAndBanks = responses[0].data;
      this.linnerList = (responses[1].data.value).split(',');
      this.closerList = (responses[2].data.value).split(',');
      this.creditCardsDropdownList = cardsAndBanks.creditCards
      this.debitCardsDropdownList = cardsAndBanks.debitCards
      this.banksDropdownList = cardsAndBanks.banks
    }, () => {
      this.toastr.error('Error al cargar formulario')
      this.router.navigateByUrl('/');
    })
  }

  public onMaritalStatusChange() {
    const maritalStatus = this.createClientForm.get('maritalStatus').value
    if (maritalStatus === 'Soltero') {
      this.createClientForm.get('coOwnerName').setValue(null)
      this.createClientForm.get('coOwnerLastName').setValue(null)
      this.createClientForm.get('coOwnerGender').setValue(null)
      this.createClientForm.get('coOwnerAge').setValue(null)
      this.createClientForm.get('coOwnerProfession').setValue(null)
      this.createClientForm.get('coOwnerDocumentType').setValue(null)
      this.createClientForm.get('coOwnerDocumentNumber').setValue(null)
      this.createClientForm.get('coOwnerPhoneNumber').setValue(null)
      this.createClientForm.get('coOwnerEmail').setValue(null)
      this.createClientForm.get('coOwnerMonthlyIncome').setValue(null)
      this.createClientForm.get('coOwnerHasWorkedWithTourismIndustry').setValue(null)
      this.createClientForm.get('coOwnerTourismIndustry').setValue(null)
      this.createClientForm.get('coOwnerDebitCreditBanks').setValue(null)
      this.createClientForm.controls.coOwnerDebitCreditCards = this.formBuilder.array([this.createCard()])
    }
  }

  private createCard(card?): UntypedFormGroup {
    return this.formBuilder.group({
      cardType: new UntypedFormControl(card ? card.cardType || null : null),
      franchiseName: new UntypedFormControl(card ? card.franchiseName || null : null),
      bankName: new UntypedFormControl(card ? card.bankName || null : null)
    });
  }

  public addClientCard() {
    const clientDebitCreditCards = this.createClientForm.get('clientDebitCreditCards') as UntypedFormArray;
    clientDebitCreditCards.push(this.createCard());
  }

  public addCoOwnerCard() {
    const clientDebitCreditCards = this.createClientForm.get('coOwnerDebitCreditCards') as UntypedFormArray;
    clientDebitCreditCards.push(this.createCard());
  }

  public removeClientCard(cardIndex) {
    const clientDebitCreditCards = this.createClientForm.get('clientDebitCreditCards') as UntypedFormArray;
    clientDebitCreditCards.removeAt(cardIndex)
  }

  public removeCoOwnerCard(cardIndex) {
    const coOwnerDebitCreditCards = this.createClientForm.get('coOwnerDebitCreditCards') as UntypedFormArray;
    coOwnerDebitCreditCards.removeAt(cardIndex)
  }

  public clearSignature(emitModified = false) {
    this.clientSignaturePad.clear();
    if (emitModified) {
      this.modifyClientSignature();
    }
  }

  public modifyClientSignature() {
    this.clientSignatureModified = true;
  }

  public submitClientForm() {
    this.spinnerService.show('createClientSpinner')
    this.loadingCreateClientForm = true
    const clientForm = this.createClientForm.value;
    clientForm.signature = this.clientSignaturePad.isEmpty() ? null : this.clientSignaturePad.toDataURL()
    clientForm.sons = Number(clientForm.sons);
    if (clientForm.otherCreditCard && clientForm.otherCreditCard !== '') {
      clientForm.creditCards.push(clientForm.otherCreditCard)
    }
    if (clientForm.checkbook && clientForm.checkbook !== '') {
      clientForm.debitCards.push(clientForm.checkbook)
    }
    this.createClientForm.disable()
    if (this.clientId) {
      clientForm.id = Number(this.clientId)
      this.clientService.put(clientForm)
        .pipe(finalize(() => {
          this.spinnerService.hide('createClientSpinner')
          this.createClientForm.enable();
          this.loadingCreateClientForm = false
        }))
        .subscribe(() => {
          this.toastr.success('Cliente editado de manera exitosa.')
          this.router.navigateByUrl(`/`)
        }, () => this.toastr.error('Hubo un error editando el cliente, por favor intente de nuevo'))
    } else {
      this.clientService.post(clientForm)
        .pipe(finalize(() => {
          this.spinnerService.hide('createClientSpinner')
          this.createClientForm.enable();
          this.loadingCreateClientForm = false
        }))
        .subscribe(res => {
          const client = res.data;
          this.createClientForm.reset()
          this.createClientOptionsModal.open(client.id)
        }, () => this.toastr.error('Hubo un error creando el cliente, por favor intente de nuevo'))
    }
  }
}
