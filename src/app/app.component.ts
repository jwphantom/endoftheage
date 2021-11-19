import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import firebase from 'firebase';
import { AuthService } from './services/authservice.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private authService : AuthService) {
    
    }



  ngOnInit() {

    this.authService.getIsAdmin();

    let pseudoLocal = localStorage.getItem('pseudo');

    if(!pseudoLocal){
      localStorage.setItem('pseudo', 'Anonyme');
    }

  }




}
