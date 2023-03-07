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
  constructor(private service: JadoreService, private router: Router) {

  }
  ngOnInit() {
    this.service.get('http://localhost:8080/api2/courses').subscribe(data => {
      console.log('courses', data)
      this.courses = data.content;
    })
  }
  goTocourse(id: string) {
    this.router.navigate(['/course'], { state: { id: id } });
  }
}
