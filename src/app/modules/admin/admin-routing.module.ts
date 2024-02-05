import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AdminComponent} from './components/admin.component';
import {ConfigurationComponent} from './components/configuration/configuration.component';
import {ManifestComponent} from './components/manifest/manifest.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    children:
      [
        {
          path: '', redirectTo: 'configurations'
        },
        {
          path: 'configuration', component: ConfigurationComponent
        },
        {
          path: 'manifest', component: ManifestComponent
        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
