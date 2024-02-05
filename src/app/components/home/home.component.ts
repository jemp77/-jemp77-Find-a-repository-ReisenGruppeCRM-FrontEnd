import { Component, HostListener, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, switchMap } from 'rxjs/operators';
import { GeonamesService } from '../../services/utils/genonames.service';
import { QuoterService } from '../../services/quoter/quoter.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  screenWidth: number;
  videoUrl: string;
  carouselItems = [];
  allies = [
    {
      logo: 'riu.png'
    },
    {
      logo: 'barcelo.png'
    },
    {
      logo: 'nautilos.png'
    },
    {
      logo: 'hilton.png'
    },
    {
      logo: 'hyatt.png'
    }
  ];
  loadingContactFormSubmit = false;
  contactFormObj = {
    name: '',
    email: '',
    cellphone: '',
    destination: '',
    arrivalDate: '',
    departureDate: '',
    rooms: [{
      adults: 0,
      kids: 0,
      kidsAges: [],
    }]
  };
  isDateRangeValid = true;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
    console.log(this.screenWidth);
  }

  constructor(private sanitizer: DomSanitizer,
              private toastr: ToastrService,
              private spinnerService: NgxSpinnerService,
              private geonamesService: GeonamesService,
              private quoterService: QuoterService) {
    this.getScreenSize();
    this.quoterService.getLandingAssets().subscribe(res => {
      const { images = [], videos = [] } = res.data;
      this.videoUrl = videos[0];
      console.log(this.videoUrl);
      images.forEach(image => {
        this.carouselItems.push({ imageUrl: image })
      })
    })
  }

  ngOnInit(): void {
  }

  getSanitizedURL() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
  }

  goToSection(sectionId: string): void {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term =>
        term.length < 2
          ? of([])
          : this.geonamesService.search(term).pipe(
            map(results => {
              return results.filter(result => {
                // Filter out cities that don't have an airport feature code
                return result.fclName === 'city, village,...'
              });
            }),
            map(filteredData => {
              return filteredData.map(item => {
                return `${item.name}, ${item.countryName}`;
              });
            }),
            catchError(() => of([]))
          )
      )
    );

  validateRange() {
    if (this.contactFormObj.arrivalDate && this.contactFormObj.departureDate) {
      this.isDateRangeValid = Date.parse(this.contactFormObj.arrivalDate) <= Date.parse(this.contactFormObj.departureDate);
    }
  }

  onKidsNumberChange(roomIndex) {
    this.contactFormObj.rooms[roomIndex].kidsAges = [];
    for (let i = 0; i < this.contactFormObj.rooms[roomIndex].kids; i++) {
      this.contactFormObj.rooms[roomIndex].kidsAges.push({ value: 0 })
    }
  }

  addRoom() {
    this.contactFormObj.rooms.push({ adults: 0, kids: 0, kidsAges: [] })
  }

  removeRoom(roomIndex: number) {
    this.contactFormObj.rooms.splice(roomIndex, 1)
  }

  public submit() {
    let hasAgesError = false;
    this.contactFormObj.rooms.forEach(room => {
      if (room.kids > 0) {
        if (room.kidsAges.length < (room.kids)) {
          hasAgesError = true;
        }
      }
    })
    if (hasAgesError) {
      this.toastr.error('Por favor ingrese todas las edades correspondientes.')
      return;
    }
    this.loadingContactFormSubmit = true;
    this.spinnerService.show('contactFormSpinner')
    const quotation = {
      ...this.contactFormObj,
      rooms: this.contactFormObj.rooms.map(room => ({
        ...room,
        kidsAges: room.kidsAges.map(age => age.value)
      }))
    };
    this.quoterService.post(quotation).pipe(finalize(() => {
      this.spinnerService.hide('contactFormSpinner')
    })).subscribe(() => {
      this.clearForm()
      this.toastr.success('Informacion guardada exitosamente.')
    }, () => {
      this.toastr.error('Hubo un error al guardar su informacion.')
    })
  }

  private clearForm() {
    this.contactFormObj = {
      name: '',
      email: '',
      cellphone: '',
      destination: '',
      arrivalDate: '',
      departureDate: '',
      rooms: [{
        adults: 0,
        kids: 0,
        kidsAges: [],
      }]
    }
  }
}
