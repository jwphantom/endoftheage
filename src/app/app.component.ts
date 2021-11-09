import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import firebase from 'firebase';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() {
    
    }



  ngOnInit() {
    let pseudoLocal = localStorage.getItem('pseudo');

    if(!pseudoLocal){
      localStorage.setItem('pseudo', 'Anonyme');
    }

    console.log(pseudoLocal);


  }




}
