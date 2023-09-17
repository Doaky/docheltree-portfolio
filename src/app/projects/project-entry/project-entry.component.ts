import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-entry',
  templateUrl: './project-entry.component.html',
  styleUrls: ['./project-entry.component.scss']
})
export class ProjectEntryComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    const projectEntry = this.router.url.split('/')[2];
    this.loadContent(projectEntry);
  }

  loadContent(projectEntry: string) {
    switch (projectEntry) {
      case '':
        break;
      case '':

    }
  }

}
