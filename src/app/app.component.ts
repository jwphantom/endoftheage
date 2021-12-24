import { Component } from '@angular/core';
import { AuthService } from './services/authservice.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private authService: AuthService) {

  }



  ngOnInit() {

    this.authService.getIsAdmin();

    let pseudoLocal = localStorage.getItem('pseudo');

    if (!pseudoLocal || pseudoLocal == 'anonyme') {
      localStorage.removeItem('user');
      localStorage.removeItem('pseudo');
      localStorage.removeItem('role');
      localStorage.removeItem('email');
    }

  }




}
