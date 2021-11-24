import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  private baseUrl = 'https://server-endoftheage.herokuapp.com/api';
  //private baseUrl = 'http://localhost:3001/api';

  lTheme: any;

  dETV: boolean = false;
  dETA: boolean = false;
  dETI: boolean = false;
  dETN: boolean = false;
  dETP: boolean = false;

  bETV: boolean = true;
  bETA: boolean = true;
  bETI: boolean = true;
  bETN: boolean = true;
  bETP: boolean = true;



  constructor(private title: Title,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.title.setTitle("EndOfTheAge - Blog");

    this.getTheme();
    this.loadScript('../assets/js/plugins.js');
    this.loadScript('../assets/js/main.js');
    this.loadScript('../assets/js/vendor/jquery-3.5.1.min.js');
    this.loadScript('../assets/js/vendor/jquery-migrate-3.3.0.min.js');
    this.loadScript('../assets/js/vendor/bootstrap.min.js');

  }

  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  getTheme() {
    this.http
      .get<any[]>(`${this.baseUrl}/themes`)
      .subscribe(
        (response) => {

          this.lTheme = response;
          //this.theme = response[0].name;

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );

  }


  oFileETV() {
    $('#bricks').hide();
    $('#loading').css('visibility', 'visible');

    setTimeout(() => {
      $('#loading').css('visibility', 'hidden');
      $('#bricks').show();
      this.dETV = !this.dETV;

      this.bETI = !this.bETI;
      this.bETA = !this.bETA;
      this.bETN = !this.bETN;
      this.bETP = !this.bETP;


    }, 1500);


  }

  oFileETA() {
    $('#bricks').hide();
    $('#loading').css('visibility', 'visible');

    setTimeout(() => {
      $('#loading').css('visibility', 'hidden');
      $('#bricks').show();
      this.dETA = !this.dETA;

      this.bETI = !this.bETI;
      this.bETV = !this.bETV;
      this.bETN = !this.bETN;
      this.bETP = !this.bETP;

    }, 1500);

  }

  oFileETI() {
    $('#bricks').hide();
    $('#loading').css('visibility', 'visible');


    setTimeout(() => {
      $('#loading').css('visibility', 'hidden');
      $('#bricks').show();

      this.dETI = !this.dETI;

      this.bETV = !this.bETV;
      this.bETA = !this.bETA;
      this.bETN = !this.bETN;
      this.bETP = !this.bETP;

    }, 1500);


  }

  oFileETP() {
    $('#bricks').hide();
    $('#loading').css('visibility', 'visible');


    setTimeout(() => {
      $('#loading').css('visibility', 'hidden');
      $('#bricks').show();

      this.dETP = !this.dETP;
      this.bETV = !this.bETV;
      this.bETA = !this.bETA;
      this.bETN = !this.bETN;
      this.bETI = !this.bETP;

    }, 1500);


  }

  oFileETN() {
    $('#bricks').hide();
    $('#loading').css('visibility', 'visible');


    setTimeout(() => {
      $('#loading').css('visibility', 'hidden');
      $('#bricks').show();

      this.dETN = !this.dETN;

      this.bETV = !this.bETV;
      this.bETA = !this.bETA;
      this.bETP = !this.bETN;
      this.bETI = !this.bETI;

    }, 1500);

  }


}
