
import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-content',
  imports: [],
  templateUrl: './content.html',
  styleUrl: './content.css'
})
export class ContentComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
