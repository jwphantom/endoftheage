import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/authservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  submitButton : boolean = false;

  constructor(private title: Title,
    public authService: AuthService) { }

  ngOnInit() {
    this.title.setTitle("EndOfTheAge - Sign-In");

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

  login(username : string, password :string){
    $('#submitForm').show();

    $('#NSubmitForm').hide();

    this.authService.SignIn(username, password)
  }

}
