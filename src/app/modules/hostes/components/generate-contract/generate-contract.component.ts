import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../../services/client/client.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../../../../services/contract/contract.service';
import { forkJoin, Subscription } from 'rxjs';
import { colombianDepartments } from 'app/modules/shared/config/colombia-departments';
import * as lodash from 'lodash'
import { SimpleOptionsModalComponent } from '../../../shared/components/simple-options-modal/simple-options-modal.component';
import { ConfigurationSettingsService } from '../../../../services/configuration/configuration-settings.service';
import { NgSignaturePadOptions, SignaturePadComponent } from '@almothafar/angular-signature-pad';

@Component({
  selector: 'app-generate-contract',
  templateUrl: './generate-contract.component.html',
  providers: [DatePipe],
  styleUrls: ['./generate-contract.component.scss'],
})
export class GenerateContractComponent implements OnInit, OnDestroy {
  @ViewChild('contractorSignaturePadComponent') contractorSignaturePad: SignaturePadComponent;
  @ViewChild('coOwnerSignaturePadComponent') coOwnerSignaturePad: SignaturePadComponent;
  @ViewChild('adviser1SignaturePadComponent') adviser1SignaturePad: SignaturePadComponent;
  @ViewChild('adviser2SignaturePadComponent') adviser2SignaturePad: SignaturePadComponent;
  @ViewChild('authorizationSignaturePadComponent') authorizationSignaturePad: SignaturePadComponent;
  @ViewChild('printContractOptionsModal') printContractOptionsModal: SimpleOptionsModalComponent
  public clientId = this.route.snapshot.params.clientId;
  public contractId = this.route.snapshot.params.contractId;
  public loadingGenerateContractForm = false;
  public generateContractForm: UntypedFormGroup;
  public maxContractDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
  private durationYears$: Subscription = new Subscription();
  private membershipPrice$: Subscription = new Subscription();
  private entryPrice$: Subscription = new Subscription();
  private cuiPrice$: Subscription = new Subscription();
  private lendInstallments$: Subscription = new Subscription();
  private creditCardPayment$: Subscription = new Subscription();
  private debitCardPayment$: Subscription = new Subscription();
  private transferPayment$: Subscription = new Subscription();
  private cashPayment$: Subscription = new Subscription();
  public signatureConfig: NgSignaturePadOptions = {
    canvasWidth: 550,
    canvasHeight: 200
  };
  public docTypesList = [
    {itemId: 'CC', itemLabel: 'Cedula de ciudadania'},
    {itemId: 'CE', itemLabel: 'Cedula de extranjeria'},
    {itemId: 'PP', itemLabel: 'Pasaporte'},
  ];
  public colombianDepartments = colombianDepartments().map(({id, name}) => ({itemId: id, itemLabel: name}));
  public contractorDepartmentCities = [];
  public coOwnerDepartmentCities = [];
  public printContractModalModel = {
    title: 'Imprimir Contrato',
    description: 'Desea imprimir este contrato?',
    acceptLabel: 'Si',
    cancelLabel: 'No'
  }

  constructor(private clientService: ClientService,
              private contractService: ContractService,
              private configurationSettingsService: ConfigurationSettingsService,
              private toastr: ToastrService,
              private datePipe: DatePipe,
              private formBuilder: UntypedFormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private spinnerService: NgxSpinnerService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.populateForm();
  }

  ngOnDestroy(): void {
    this.endFormSubscriptions()
  }

  private createForm(): void {
    this.generateContractForm = this.formBuilder.group({
      // contract info fields
      contractDate: new UntypedFormControl(this.datePipe.transform(new Date(), 'yyyy-MM-dd')),
      contractNumber: new UntypedFormControl(null, Validators.required),
      // client preload fields
      clientId: new UntypedFormControl(null),
      clientName: new UntypedFormControl(null, Validators.required),
      clientLastName: new UntypedFormControl(null, Validators.required),
      clientDocumentType: new UntypedFormControl(null, Validators.required),
      clientDocumentNumber: new UntypedFormControl(null, Validators.required),
      clientEmail: new UntypedFormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
      clientPhoneNumber: new UntypedFormControl(null, Validators.required),
      clientProfession: new UntypedFormControl(null, Validators.required),
      clientMaritalStatus: new UntypedFormControl({value: null, disabled: true}),
      // client pending fields
      contractorCountry: new UntypedFormControl(null, Validators.required),
      contractorDepartment: new UntypedFormControl(null, Validators.required),
      contractorCity: new UntypedFormControl(null, Validators.required),
      contractorAddress: new UntypedFormControl(null, Validators.required),
      contractorOffice: new UntypedFormControl(null),
      contractorCellphone: new UntypedFormControl(null, Validators.required),
      contractorBirthDate: new UntypedFormControl(null, Validators.required),
      // co owner pending fields
      coOwnerName: new UntypedFormControl(null),
      coOwnerLastName: new UntypedFormControl(null),
      coOwnerDocumentType: new UntypedFormControl(null),
      coOwnerDocumentNumber: new UntypedFormControl(null),
      coOwnerEmail: new UntypedFormControl(null, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')),
      coOwnerPhoneNumber: new UntypedFormControl(null),
      coOwnerProfession: new UntypedFormControl(null),
      coOwnerCountry: new UntypedFormControl(null),
      coOwnerDepartment: new UntypedFormControl(null),
      coOwnerCity: new UntypedFormControl(null),
      coOwnerAddress: new UntypedFormControl(null),
      coOwnerOffice: new UntypedFormControl(null),
      coOwnerCellphone: new UntypedFormControl(null),
      coOwnerBirthDate: new UntypedFormControl(null),
      // beneficiaries
      beneficiaries: this.formBuilder.array([this.createBeneficiary()]),
      // entry
      durationYears: new UntypedFormControl(null, Validators.required),
      membershipPrice: new UntypedFormControl(null, [Validators.pattern('^[0-9]*$'), Validators.required]),
      entryPrice: new UntypedFormControl(null, [Validators.pattern('^[0-9]*$'), Validators.required]),
      cuiPrice: new UntypedFormControl(null, [Validators.pattern('^[0-9]*$'), Validators.required]),
      lendValue: new UntypedFormControl(null, Validators.pattern('^[0-9]*$')),
      lendInstallments: new UntypedFormControl(null),
      lendInstallmentDate: new UntypedFormControl(null),
      lendInstallmentPrice: new UntypedFormControl(null, Validators.pattern('^[0-9]*$')),
      observations: new UntypedFormControl(null),
      // Payment
      creditCardPayment: new UntypedFormControl(null, Validators.pattern('^[0-9]*$')),
      debitCardPayment: new UntypedFormControl(null, Validators.pattern('^[0-9]*$')),
      transferPayment: new UntypedFormControl(null, Validators.pattern('^[0-9]*$')),
      cashPayment: new UntypedFormControl(null, Validators.pattern('^[0-9]*$')),
      totalPayment: new UntypedFormControl(null, [Validators.pattern('^[0-9]*$'), Validators.required])
    });
    this.addFormSubscriptions()
  }

  private addFormSubscriptions() {
    this.durationYears$ = this.generateContractForm.get('durationYears').valueChanges.subscribe(() => {
      this.validateLendInstallments();
    })

    this.membershipPrice$ = this.generateContractForm.get('membershipPrice').valueChanges.subscribe(value => {
      this.currencyFormatField(value, 'membershipPrice')
      this.generateContractForm.get('entryPrice').setValue(null)
      this.generateContractForm.get('cuiPrice').setValue(null)
      this.resetPaymentFields();
    });
    this.entryPrice$ = this.generateContractForm.get('entryPrice').valueChanges.subscribe(value => {
      this.currencyFormatField(value, 'entryPrice')
      this.validateMembershipPrices();
      this.validateLendInstallments();
      this.resetPaymentFields();
    });
    this.cuiPrice$ = this.generateContractForm.get('cuiPrice').valueChanges.subscribe(value => {
      this.currencyFormatField(value, 'cuiPrice')
      this.validateMembershipPrices();
      this.validateLendInstallments();
      this.resetPaymentFields();
    });
    this.lendInstallments$ = this.generateContractForm.get('lendInstallments').valueChanges.subscribe(() => {
      this.validateLendInstallments()
    });
    this.debitCardPayment$ = this.generateContractForm.get('debitCardPayment').valueChanges.subscribe(value => {
      this.currencyFormatField(value, 'debitCardPayment')
      this.validatePayment()
    })
    this.creditCardPayment$ = this.generateContractForm.get('creditCardPayment').valueChanges.subscribe(value => {
      this.currencyFormatField(value, 'creditCardPayment')
      this.validatePayment()
    })
    this.transferPayment$ = this.generateContractForm.get('transferPayment').valueChanges.subscribe(value => {
      this.currencyFormatField(value, 'transferPayment')
      this.validatePayment()
    })
    this.cashPayment$ = this.generateContractForm.get('cashPayment').valueChanges.subscribe(value => {
      this.currencyFormatField(value, 'cashPayment')
      this.validatePayment()
    })

  }

  private endFormSubscriptions() {
    this.membershipPrice$.unsubscribe();
    this.entryPrice$.unsubscribe();
    this.cuiPrice$.unsubscribe();
    this.lendInstallments$.unsubscribe();
    this.debitCardPayment$.unsubscribe();
    this.creditCardPayment$.unsubscribe();
    this.transferPayment$.unsubscribe();
    this.cashPayment$.unsubscribe();
  }

  private currencyFormatField(value, fieldName) {
    if (typeof value === 'string' || value instanceof String) {
      const num = Number(value.replace(/[^0-9.]+/g, ''));
      this.generateContractForm.get(fieldName).setValue(num, {emitEvent: false, emitViewToModelChange: false});
    }
  }

  public validateMembershipPrices() {
    const cuiPrice = Number(this.generateContractForm.get('cuiPrice').value)
    const entryPrice = Number(this.generateContractForm.get('entryPrice').value)
    const membershipPrice = Number(this.generateContractForm.get('membershipPrice').value)
    const entryAndCuiPrice = entryPrice + cuiPrice
    if (entryAndCuiPrice > membershipPrice) {
      this.generateContractForm.get('cuiPrice').setErrors({invalidPrice: true})
      this.generateContractForm.get('entryPrice').setErrors({invalidPrice: true})
    } else {
      this.generateContractForm.get('cuiPrice').setErrors(null)
      this.generateContractForm.get('entryPrice').setErrors(null)
      const lendValue = membershipPrice - entryAndCuiPrice;
      this.generateContractForm.get('lendValue').setValue(lendValue)
    }
  }

  public validateLendInstallments() {
    const durationYears = this.generateContractForm.get('durationYears').value
    const lendValue = this.generateContractForm.get('lendValue').value
    const lendInstallmentsControl = this.generateContractForm.get('lendInstallments')
    const lendInstallmentsDateControl = this.generateContractForm.get('lendInstallmentDate')
    const lendInstallmentPriceControl = this.generateContractForm.get('lendInstallmentPrice')
    const shouldValidateLendInstallments: boolean = (lendValue && lendValue !== 0)
    if (shouldValidateLendInstallments) {
      lendInstallmentsDateControl.setValidators(Validators.required)
      if (!lendInstallmentsControl.value || lendInstallmentsControl.value === 0) {
        lendInstallmentsControl.setValue(1, {emitEvent: false, emitViewToModelChange: false})
      }
      if (!durationYears || durationYears === 0) {
        lendInstallmentsControl.setErrors({durationYearsRequired: true})
      } else {
        lendInstallmentsControl.setErrors(null)
        if (lendInstallmentsControl.value > durationYears * 12) {
          lendInstallmentsControl.setErrors({invalidNumberOfInstallments: true})
        } else {
          lendInstallmentsControl.setErrors(null)
          const lendInstallmentPrice = Math.ceil(lendValue / lendInstallmentsControl.value);
          lendInstallmentPriceControl.setValue(lendInstallmentPrice)
        }
      }
    } else {
      lendInstallmentsControl.setValue(null, {emitEvent: false, emitViewToModelChange: false})
      lendInstallmentPriceControl.setValue(null)
      lendInstallmentsDateControl.setValidators(null)
      lendInstallmentsDateControl.setValue(null)
    }
    lendInstallmentsDateControl.updateValueAndValidity()
  }

  public resetPaymentFields() {
    this.generateContractForm.get('debitCardPayment').setValue(null)
    this.generateContractForm.get('creditCardPayment').setValue(null)
    this.generateContractForm.get('transferPayment').setValue(null)
    this.generateContractForm.get('cashPayment').setValue(null)
    this.generateContractForm.get('totalPayment').setValue(null)
  }

  public validatePayment() {
    const debitCardPayment = this.generateContractForm.get('debitCardPayment').value
    const creditCardPayment = this.generateContractForm.get('creditCardPayment').value
    const transferPayment = this.generateContractForm.get('transferPayment').value
    const cashPayment = this.generateContractForm.get('cashPayment').value
    const lendValue = this.generateContractForm.get('lendValue').value
    const membershipPrice = this.generateContractForm.get('membershipPrice').value
    const totalPaymentControl = this.generateContractForm.get('totalPayment')
    const totalPayment = (debitCardPayment + creditCardPayment + transferPayment + cashPayment + lendValue)
    totalPaymentControl.setValue(totalPayment)
    if (totalPayment !== membershipPrice) {
      totalPaymentControl.setErrors({totalPaymentError: true})
    } else {
      totalPaymentControl.setErrors(null)
    }
  }

  public onContractorCountryChange() {
    this.generateContractForm.get('contractorDepartment').setValue(null)
    this.generateContractForm.get('contractorCity').setValue(null)
  }

  public onCoOwnerCountryChange() {
    this.generateContractForm.get('coOwnerDepartment').setValue(null)
    this.generateContractForm.get('coOwnerCity').setValue(null)
  }

  public loadContractorDepartmentCities(departmentName) {
    if (departmentName) {
      const departmentObj = colombianDepartments().find(d => d.name === departmentName)
      if (departmentObj) {
        this.contractorDepartmentCities = departmentObj.cities.map((c) => ({itemId: c, itemLabel: c}))
      }
    }
  }

  public loadCoOwnerDepartmentCities(departmentName) {
    if (departmentName) {
      const departmentObj = colombianDepartments().find(d => d.name === departmentName)
      if (departmentObj) {
        this.coOwnerDepartmentCities = departmentObj.cities.map((c) => ({itemId: c, itemLabel: c}))
      }
    }
  }

  private createBeneficiary(beneficiary?): UntypedFormGroup {
    return this.formBuilder.group({
      names: new UntypedFormControl(beneficiary ? beneficiary.names || null : null),
      lastNames: new UntypedFormControl(beneficiary ? beneficiary.lastNames || null : null),
      documentType: new UntypedFormControl(beneficiary ? beneficiary.documentType || null : null),
      documentNumber: new UntypedFormControl(beneficiary ? beneficiary.documentNumber || null : null),
      birthDate: new UntypedFormControl(beneficiary ? beneficiary.birthDate ?
        this.datePipe.transform(beneficiary.birthDate, 'yyyy-MM-dd') : null : null),
    });
  }

  public addBeneficiary() {
    const beneficiaries = this.generateContractForm.get('beneficiaries') as UntypedFormArray;
    beneficiaries.push(this.createBeneficiary());
  }

  public removeBeneficiary(beneficiaryIndex) {
    const beneficiaries = this.generateContractForm.get('beneficiaries') as UntypedFormArray;
    beneficiaries.removeAt(beneficiaryIndex)
  }

  private populateForm() {
    this.loadingGenerateContractForm = true;
    this.spinnerService.show('generateContractSpinner')
    if (this.clientId) {
      forkJoin([this.contractService.getContractNumber(),
        this.configurationSettingsService.queryConfigurationSettings('administrativeDirectorSignature'),
        this.clientService.get(this.clientId)])
        .pipe(finalize(() => {
          this.loadingGenerateContractForm = false;
          this.spinnerService.hide('generateContractSpinner')
        }))
        .subscribe(responses => {
          const contractNumberData = responses[0].data
          const administrativeDirectorSignature = responses[1].data
          this.authorizationSignaturePad.fromDataURL(administrativeDirectorSignature.value,
            {
              width: this.signatureConfig.canvasWidth,
              height: this.signatureConfig.canvasHeight,
            })
          const clientData = responses[2].data
          const contractFormValue = {
            clientId: clientData.id,
            clientName: clientData.name,
            clientLastName: clientData.lastName,
            clientDocumentType: clientData.documentType,
            clientDocumentNumber: clientData.documentNumber,
            clientEmail: clientData.email,
            clientPhoneNumber: clientData.phoneNumber,
            clientProfession: clientData.profession,
            coOwnerName: clientData.coOwnerName,
            coOwnerLastName: clientData.coOwnerLastName,
            coOwnerProfession: clientData.coOwnerProfession,
            coOwnerDocumentType: clientData.coOwnerDocumentType,
            coOwnerDocumentNumber: clientData.coOwnerDocumentNumber,
            coOwnerPhoneNumber: clientData.coOwnerPhoneNumber,
            coOwnerEmail: clientData.coOwnerEmail,
            clientMaritalStatus: clientData.maritalStatus
          }
          this.generateContractForm.get('contractNumber').setValue(contractNumberData.contractNumber)
          this.generateContractForm.patchValue(contractFormValue)
        }, () => {
          this.toastr.error('Error al cargar formulario')
          this.router.navigateByUrl('/');
        })
    }
    if (this.contractId) {
      this.contractService.get(this.contractId)
        .pipe(finalize(() => {
          this.loadingGenerateContractForm = false;
          this.spinnerService.hide('generateContractSpinner')
        })).subscribe(res => {
        const contractData = res.data;
        contractData.contractDate = this.datePipe.transform(contractData.contractDate, 'yyyy-MM-dd')
        contractData.lendInstallmentDate = this.datePipe.transform(contractData.lendInstallmentDate, 'yyyy-MM-dd')
        const clientData = lodash.cloneDeep(contractData.client)
        delete contractData.client
        const contractFormValue = {
          // contractorData
          clientId: clientData.id,
          clientName: clientData.name,
          clientLastName: clientData.lastName,
          clientDocumentType: clientData.documentType,
          clientDocumentNumber: clientData.documentNumber,
          clientEmail: clientData.email,
          clientPhoneNumber: clientData.phoneNumber,
          clientProfession: clientData.profession,
          contractorAddress: clientData.address,
          contractorCountry: clientData.country,
          contractorDepartment: clientData.department,
          contractorCity: clientData.city,
          contractorOffice: clientData.office,
          contractorCellphone: clientData.cellPhone,
          contractorBirthDate: this.datePipe.transform(clientData.birthDate, 'yyyy-MM-dd'),
          // coOwnerData
          coOwnerName: clientData.coOwnerName,
          coOwnerLastName: clientData.coOwnerLastName,
          coOwnerProfession: clientData.coOwnerProfession,
          coOwnerDocumentType: clientData.coOwnerDocumentType,
          coOwnerDocumentNumber: clientData.coOwnerDocumentNumber,
          coOwnerAddress: clientData.coOwnerAddress,
          coOwnerCellphone: clientData.coOwnerCellPhone,
          coOwnerCountry: clientData.coOwnerCountry,
          coOwnerDepartment: clientData.coOwnerDepartment,
          coOwnerCity: clientData.coOwnerCity,
          coOwnerOffice: clientData.coOwnerOffice,
          coOwnerBirthDate: this.datePipe.transform(clientData.coOwnerBirthDate, 'yyyy-MM-dd'),
          coOwnerPhoneNumber: clientData.coOwnerPhoneNumber,
          coOwnerEmail: clientData.coOwnerEmail,
          // coOwnerData
          clientMaritalStatus: clientData.maritalStatus,
          ...contractData
        }
        this.loadContractorDepartmentCities(contractFormValue.contractorDepartment)
        this.loadCoOwnerDepartmentCities(contractFormValue.coOwnerDepartment)
        this.contractorSignaturePad.fromDataURL(contractFormValue.contractorSignature, {
          width: this.signatureConfig.canvasWidth,
          height: this.signatureConfig.canvasHeight,
        })
        this.coOwnerSignaturePad.fromDataURL(contractFormValue.coOwnerSignature, {
          width: this.signatureConfig.canvasWidth,
          height: this.signatureConfig.canvasHeight,
        })
        this.adviser1SignaturePad.fromDataURL(contractFormValue.adviser1Signature, {
          width: this.signatureConfig.canvasWidth,
          height: this.signatureConfig.canvasHeight,
        })
        this.adviser2SignaturePad.fromDataURL(contractFormValue.adviser2Signature, {
          width: this.signatureConfig.canvasWidth,
          height: this.signatureConfig.canvasHeight,
        })
        this.authorizationSignaturePad.fromDataURL(contractFormValue.authorizationSignature, {
          width: this.signatureConfig.canvasWidth,
          height: this.signatureConfig.canvasHeight,
        })
        this.generateContractForm.patchValue(contractFormValue)
        if (contractData.contractBeneficiaries && contractData.contractBeneficiaries.length > 0) {
          this.removeBeneficiary(0)
          const beneficiaries = this.generateContractForm.get('beneficiaries') as UntypedFormArray;
          contractData.contractBeneficiaries.forEach(b => {
            beneficiaries.push(this.createBeneficiary(b));
          })
        }
        if (this.router.url.includes('/contract-detail/')) {
          this.generateContractForm.disable({emitEvent: false});
        }
      })
    }
  }

  public generateOrEditContract() {
    this.spinnerService.show('generateContractSpinner')
    this.loadingGenerateContractForm = true
    if (this.clientId) {
      const contract = this.formatContract(this.generateContractForm.value);
      this.contractService.post(contract)
        .pipe(finalize(() => {
          this.spinnerService.hide('generateContractSpinner')
          this.loadingGenerateContractForm = false
        }))
        .subscribe((res) => {
          this.toastr.success('Contrato generado exitosamente.')
          const contractData = res.data;
          this.sendWelcomeMail(contract.client);
          this.printContractOptionsModal.open(contractData)
        }, () => this.toastr.error('Hubo un error generando el contrato, por favor intente de nuevo'))
    }
    if (this.contractId) {
      const contract = this.formatContract(this.generateContractForm.value);
      contract.id = Number(this.contractId)
      this.contractService.put(contract)
        .pipe(finalize(() => {
          this.spinnerService.hide('generateContractSpinner')
          this.loadingGenerateContractForm = false
        }))
        .subscribe(() => {
          this.toastr.success('Contrato editado exitosamente.')
          this.router.navigateByUrl('/hostes/search-contract')
        }, () => {
          this.toastr.error('Hubo un error editando el contrato, por favor intente de nuevo')
        })
    }
  }

  private sendWelcomeMail(contractClient) {
    this.clientService.sendWelcomeMail({id: this.clientId}).subscribe(() => {
    }, () => {
      this.toastr.warning(
        `el correo de bienvenida no pudo ser enviado al cliente ${contractClient.name} ${contractClient.lastName}.`,
        '',
        {disableTimeOut: true}
      );
    });
  }


  public onPrintContractModalAccepted(contractData) {
    this.contractService.downloadContractReport(contractData.id)
    this.router.navigateByUrl('/')
  }

  public onPrintContractModalCanceledOrDismissed() {
    this.router.navigateByUrl('/')
  }

  private formatContract(contract) {
    const formattedContract = lodash.cloneDeep(contract)
    formattedContract.client = {
      name: contract.clientName,
      lastName: contract.clientLastName,
      profession: contract.clientProfession,
      documentType: contract.clientDocumentType,
      documentNumber: contract.clientDocumentNumber,
      address: contract.contractorAddress,
      cellPhone: contract.contractorCellphone,
      country: contract.contractorCountry,
      department: contract.contractorDepartment,
      city: contract.contractorCity,
      office: contract.contractorOffice,
      birthDate: contract.contractorBirthDate,
      phoneNumber: contract.clientPhoneNumber,
      email: contract.clientEmail,
      coOwnerName: contract.coOwnerName,
      coOwnerLastName: contract.coOwnerLastName,
      coOwnerProfession: contract.coOwnerProfession,
      coOwnerDocumentType: contract.coOwnerDocumentType,
      coOwnerDocumentNumber: contract.coOwnerDocumentNumber,
      coOwnerAddress: contract.coOwnerAddress,
      coOwnerCellphone: contract.coOwnerCellphone,
      coOwnerCountry: contract.coOwnerCountry,
      coOwnerDepartment: contract.coOwnerDepartment,
      coOwnerCity: contract.coOwnerCity,
      coOwnerOffice: contract.coOwnerOffice,
      coOwnerBirthDate: contract.coOwnerBirthDate,
      coOwnerPhoneNumber: contract.coOwnerPhoneNumber,
      coOwnerEmail: contract.coOwnerEmail
    }
    formattedContract.contractorSignature = this.contractorSignaturePad.isEmpty() ? null : this.contractorSignaturePad.toDataURL();
    formattedContract.coOwnerSignature = this.coOwnerSignaturePad.isEmpty() ? null : this.coOwnerSignaturePad.toDataURL();
    formattedContract.adviser1Signature = this.adviser1SignaturePad.isEmpty() ? null : this.adviser1SignaturePad.toDataURL();
    formattedContract.adviser2Signature = this.adviser2SignaturePad.isEmpty() ? null : this.adviser2SignaturePad.toDataURL();
    formattedContract.authorizationSignature = this.authorizationSignaturePad.toDataURL();
    formattedContract.contractBeneficiaries = lodash.cloneDeep(contract.beneficiaries)
    delete formattedContract.clientName
    delete formattedContract.clientLastName
    delete formattedContract.beneficiaries
    delete formattedContract.clientProfession
    delete formattedContract.clientDocumentType
    delete formattedContract.clientDocumentNumber
    delete formattedContract.contractorAddress
    delete formattedContract.contractorCellphone
    delete formattedContract.contractorCountry
    delete formattedContract.contractorDepartment
    delete formattedContract.contractorCity
    delete formattedContract.contractorOffice
    delete formattedContract.contractorBirthDate
    delete formattedContract.clientPhoneNumber
    delete formattedContract.clientEmail
    delete formattedContract.coOwnerName
    delete formattedContract.coOwnerLastName
    delete formattedContract.coOwnerProfession
    delete formattedContract.coOwnerDocumentType
    delete formattedContract.coOwnerDocumentNumber
    delete formattedContract.coOwnerAddress
    delete formattedContract.coOwnerCellphone
    delete formattedContract.coOwnerCountry
    delete formattedContract.coOwnerDepartment
    delete formattedContract.coOwnerCity
    delete formattedContract.coOwnerOffice
    delete formattedContract.coOwnerBirthDate
    delete formattedContract.coOwnerPhoneNumber
    delete formattedContract.coOwnerEmail
    return formattedContract
  }
}
