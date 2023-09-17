import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectEntryComponent } from './projects/project-entry/project-entry.component';
import { KellyPoolComponent } from './projects/kelly-pool/kelly-pool.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects/:id', component: ProjectEntryComponent },
  { path: 'kellypool', component: KellyPoolComponent },
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
