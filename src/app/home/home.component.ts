import { Component } from '@angular/core';
import { JadoreService } from '../service/jadore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  courses: any = [];
  constructor() {

  }
  ngOnInit() {

  }

}
