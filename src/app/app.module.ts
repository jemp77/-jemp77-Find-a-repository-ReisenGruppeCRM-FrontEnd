import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { SidebarModule } from './layouts/sidebar/sidebar.module';
import { FooterModule } from './layouts/footer/footer.module';
import { NavbarModule } from './layouts/navbar/navbar.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './modules/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AppRoutingModule } from './app-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ScratchGameComponent } from './components/scratch-game/scratch-game.component';
import { HomeComponent } from './components/home/home.component';
import { IvyCarouselModule } from 'carousel-angular';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HomeComponent,
    LoginComponent,
    ScratchGameComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      tapToDismiss: true,
      positionClass: 'toast-top-right'
    }),
    FooterModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule,
    FontAwesomeModule,
    IvyCarouselModule,
    NgbTypeaheadModule
  ],
  providers: [
    {
      provide: 'environment', // Use InjectionToken
      useValue: environment
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
