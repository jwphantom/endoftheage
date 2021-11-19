import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/authservice.service';
import * as $ from 'jquery';
import * as bootstrap from "bootstrap";

@Component({
  selector: 'app-pseudo',
  templateUrl: './pseudo.component.html',
  styleUrls: ['./pseudo.component.scss']
})
export class PseudoComponent implements OnInit {

  email!: string;
  pseudo!: string;


  constructor(private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  sendPseudo() {
    this.authService.storePseudo(this.email, this.pseudo);
    this.email = '';
    this.pseudo = '';
  }

  signUp(pseudo: any,email: any) {
    this.authService.SignUp(pseudo,email);
  }

}
