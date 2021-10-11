import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { KellypoolComponent } from './kellypool/kellypool.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'kellypool', component: KellypoolComponent },
  { path: 'kellyPoolGenerator', redirectTo: 'kellypool', pathMatch: 'full' },
  { path: 'kellyPoolGenerator.html', redirectTo: 'kellypool', pathMatch: 'full' },
  { path: 'kellypoolgenerator.html', redirectTo: 'kellypool', pathMatch: 'full' },
  // { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
