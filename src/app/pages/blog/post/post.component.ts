import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PublishComponent } from 'src/app/static/publish/publish.component';
import { MatDialog } from '@angular/material/dialog';
import { AddpostComponent } from '../../modal/addpost/addpost.component';
import { Post } from 'src/app/model/post';
import { Subscription } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/authservice.service';
import getMAC, { isMAC } from 'getmac'


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {



  closeResult = '';

  s_aPost: Boolean = false;

  message: string | undefined;


  posts!: Post[];
  postsSubscription!: Subscription;


  @ViewChild(AddpostComponent) child: any;

  private auth: Boolean = false;



  constructor(private title: Title,
    public dialog: MatDialog,
    private postService: PostService,
    private authService: AuthService
  ) { }

  ngOnInit() {

    this.title.setTitle("EndOfTheAge - Post");

    this.postsSubscription = this.postService.postsSubject.subscribe(
      (posts: Post[]) => {
        this.posts = posts;
      }
    );
    this.postService.emitPosts();


    this.loadScript('../assets/js/plugins.js');
    this.loadScript('../assets/js/mobilemenu.js');
    this.loadScript('../assets/js/main.js');
    this.loadScript('../assets/js/vendor/jquery-3.5.1.min.js');
    this.loadScript('../assets/js/vendor/jquery-migrate-3.3.0.min.js');
    this.loadScript('../assets/js/vendor/bootstrap.min.js');

  }

  receiveMessage($event: Boolean) {
    this.s_aPost = $event
    console.log(this.message);
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

  modalPost() {
    const dialogRef = this.dialog.open(PublishComponent);

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  o_s_apost() {
    this.s_aPost = !this.s_aPost;
  }

  getAuth() {
    return this.authService.getisLogged();
  }

  dPost(uid: string) {
    this.postService.deletePost(uid);
  }


}
