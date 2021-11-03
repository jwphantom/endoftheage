import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

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
