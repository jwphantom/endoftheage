import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import firebase from 'firebase';
import { AuthService } from './services/authservice.service';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private authService: AuthService,
    private socket: Socket) {

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
