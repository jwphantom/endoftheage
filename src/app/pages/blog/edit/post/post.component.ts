import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { AuthService } from 'src/app/services/authservice.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  public id! : string;

  authcomment: Boolean = false;


  constructor(private route: ActivatedRoute,
    private postService: PostService,
    private title: Title,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public afs: AngularFirestore,
    private socket: Socket) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id')!;


    this.title.setTitle("EndOfTheAge - EndTime : "+this.id);

    if (localStorage.getItem('email')) {
      this.authcomment = true
    } else {
      this.authcomment = false;

    }

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

}
