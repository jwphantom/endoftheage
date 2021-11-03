import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(private authService : AuthService
    ) { }

  ngOnInit(): void {
  }

  getAuth(){
    return this.authService.getisLogged();
  }

  logout(){
    this.authService.SignOut();

  }

}
