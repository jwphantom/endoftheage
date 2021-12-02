import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-block-menu',
  templateUrl: './block-menu.component.html',
  styleUrls: ['./block-menu.component.scss']
})
export class BlockMenuComponent implements OnInit {

  lMenu: any;
  //private baseUrl = 'https://server-endoftheage.herokuapp.com/api';
  private baseUrl = 'http://localhost:3001/api';



  constructor(private title: Title,
    private http: HttpClient,
    public router: Router,

  ) { }

  ngOnInit(): void {
    this.getMenu();

  }

  getMenu() {
    this.http
      .get<any[]>(`${this.baseUrl}/menu`)
      .subscribe(
        (response) => {

          this.lMenu = response;
          console.log(this.lMenu);
          //this.theme = response[0].name;

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );

  }

}
