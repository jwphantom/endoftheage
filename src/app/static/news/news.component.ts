import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GlobalConstants } from '../../common/global-constants';
import { Post } from 'src/app/model/post';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  lMenu: any;
  idTheme: any;
  idMenu: any;
  post! : any ;

  private baseUrl = GlobalConstants.apiURL;
  admins: any;




  constructor(private title: Title,
    private http: HttpClient,
    public router: Router,

  ) { }

  ngOnInit(): void {
    this.getLastNews();

  }

  getMenuNews() {
    this.http
      .get<any[]>(`${this.baseUrl}/menu/61a8c4b459ba2c99c1ec80e2`)
      .subscribe(
        (response) => {

          this.lMenu = response;
          this.idMenu = this.lMenu._id
          this.idTheme = this.lMenu.theme[0].id;
          console.log(this.idTheme);
          //this.getLastNews(this.idMenu,this.idTheme);

          //this.theme = response[0].name;

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );

  }

  getAllAdmin() {
    this.http
      .get<any[]>(`${this.baseUrl}/getAllAdmin`)
      .subscribe(
        (response) => {

          this.admins = response;
          //this.theme = response[0].name;

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
  }

  getLastNews() {

    this.http
      .get<any[]>(`${this.baseUrl}/last-news/61a8c4b459ba2c99c1ec80e2/AcKH2aaOOA6p4NGIBUkl`)
      .subscribe(
        (response) => {

          console.log(response);
          this.post = response;

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );

  }

}
