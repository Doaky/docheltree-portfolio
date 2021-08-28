import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { KellypoolComponent } from './kellypool/kellypool.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'kellypool', component: KellypoolComponent },
  { path: 'kellyPoolGenerator.html', component: KellypoolComponent },
  { path: 'kellyPoolGenerator', component: KellypoolComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
