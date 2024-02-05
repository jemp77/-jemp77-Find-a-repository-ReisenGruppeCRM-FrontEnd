import {NgModule} from '@angular/core';
import {DashboardComponent} from '../../modules/dashboard/dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../guards/auth.guard';
import {MainLayoutComponent} from './main-layout.component';

const routes: Routes = [
  {
    path: '', component: MainLayoutComponent,
    children:
      [
        {
          path: '', component: DashboardComponent
        },
        {
          path: 'hostes',
          loadChildren: () => import('../../modules/hostes/hostes.module').then(m => m.HostesModule),
          canActivate: [AuthGuard]
        },
        {
          path: 'booking',
          loadChildren: () => import('../../modules/booking/booking.module').then(m => m.BookingModule),
          canActivate: [AuthGuard]
        },
        {
          path: 'customer-service',
          loadChildren: () => import('../../modules/customer-service/customer-service.module').then(m => m.CustomerServiceModule),
          canActivate: [AuthGuard]
        },
        {
          path: 'admin',
          loadChildren: () => import('../../modules/admin/admin.module').then(m => m.AdminModule),
          canActivate: [AuthGuard]
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule {
}
