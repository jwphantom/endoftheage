import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/model/post';
import { AuthService } from 'src/app/services/authservice.service';
import { PostService } from 'src/app/services/post.service';
import { GlobalConstants } from '../../../common/global-constants';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-catpost',
  templateUrl: './catpost.component.html',
  styleUrls: ['./catpost.component.scss']
})
export class CatpostComponent implements OnInit {

  private baseUrl = GlobalConstants.apiURL;


  public cat!: string;
  public theme!: string;

  postsSubscription!: Subscription;
  public posts: any;

  s_aPost: Boolean = false;

  message: string | undefined;

  comments!: Comment[];
  commentsSubscription!: Subscription;

  pcomment!: string;

  authcomment: Boolean = false;

  pseudo: string = '';

  countLike!: number;

  private auth: Boolean = false;

  admins: any;


  menu: any;

  pView: Array<string> = [];

  nTheme!: string;


  commentForm!: FormGroup;
  emailUser = localStorage.getItem('email');
  roleUser = localStorage.getItem('role');
  pseudoUser = localStorage.getItem('pseudo');



  constructor(private route: ActivatedRoute,
    private postService: PostService,
    private title: Title,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public afs: AngularFirestore,
    private router: Router,
    private http: HttpClient,
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private socket: Socket) { }

  ngOnInit(): void {

    this.cat = this.route.snapshot.paramMap.get('cat')!;
    this.theme = this.route.snapshot.paramMap.get('theme')!;


    this.title.setTitle("EndOfTheAge - EndTime");

    this.authcomment = this.authService.getisLogged();


    this.storePost(this.cat, this.theme);
    this.upPostafterCreate();
    this.upPostafterDelete();
    this.upComment();
    this.upLike();
    this.addCommentForm()
    this.getAllAdmin();
    this.upPseudoCreate();
    this.getMenuById(this.cat, this.theme);

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


  storePost(cat: string, theme: string) {

    this.postsSubscription = this.postService.postsByCatSubject.subscribe(
      (posts: Post[]) => {
        this.posts = posts;
      }
    );

    this.postService.getPostsByCatTheme(cat, theme)

    //this.postService.emitPostsByCat();
  }

  getAuth() {
    return this.authService.getisLogged();
  }


  o_s_apost() {
    this.s_aPost = !this.s_aPost;
  }

  dPost(uid: string) {
    this.postService.deletePost(uid);
  }

  ePost(uid: string) {
    this.router.navigate(['/post/edit', uid])
  }


  addCommentForm() {
    this.commentForm = this.formBuilder.group({
      pcomment: ['', Validators.required],
    });
  }

  upPseudoCreate() {

    this.socket.on(`get-update-pseudo`, (email: any) => {

      if (localStorage.getItem('email') == email.email[0]) {
        this.authcomment = this.authcomment = this.authService.getisLogged();

      } else {
        this.authcomment = false;

      }
    })

  }

  upPostafterCreate() {
    this.socket.on('send-posts-afterCreate', (newPost: any) => {

      this.posts.push(newPost['newPost']);
    })

  }

  upPostafterDelete() {
    this.socket.on('send-posts-afterDelete', (id: any) => {

      for (let i = 0; i < this.posts.length; i++) {
        if (this.posts[i]._id == id.id) {
          this.posts.splice(i, 1)
        }
      }
    })

  }

  upComment() {
    this.socket.on('get-update-comment', (comment: any) => {


      let sPost = this.posts.filter(function (item: { _id: string; }) { return item._id === comment.comment[1] });

      sPost[0].comments.push(comment.comment[0].at(-1))

    })

  }

  upLike() {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        if (user.email) {

          this.socket.on(`get-update-like`, (like: any) => {

            let found = this.posts.filter(function (item: { _id: string; }) { return item._id === like.like[1]; });
            found[0].likes = like.like[0];

           
          })
        }
      }
    })

  }

  receiveMessage($event: Boolean) {
    this.s_aPost = $event
  }

  dComment(_id: string) {

    if ($(`.dComment-${_id}`).hasClass(`.dComment-${_id}-true`)) {
      $(`.dComment-${_id}`).removeClass(`.dComment-${_id}-true`);
      $(`.dComment-${_id}`).hide();

    } else {
      $(`.dComment-${_id}`).addClass(`.dComment-${_id}-true`);
      $(`.dComment-${_id}`).show();

    }

  }

  delComment(comments: any, pId: string, i: number) {

    this.postService.deleteComment(comments, pId, i);

  }


  like(post: Post, _id: string) {

    var user = firebase.auth().currentUser;

    if (user) {
      this.postService.sendLike(post, _id);
    }

  }

  sendComment(post: Post, id: string) {

    const comment = this.commentForm.get('pcomment')?.value;


    if (comment.length == 0) {
      $('#flash_message_comment_empty').show();

      setTimeout(function () {
        $('#flash_message_comment_empty').hide();
      }, 5000);


    } else {

      let _id = id;

      if (!$(`.dComment-${_id}`).hasClass(`.dComment-${_id}-true`)) {
        $(`.dComment-${_id}`).addClass(`.dComment-${_id}-true`);
        $(`.dComment-${_id}`).show();
        this.postService.sendComment(comment, post, id);
        this.commentForm.reset();
      } else {
        this.postService.sendComment(comment, post, id);
        this.commentForm.reset();

      }
    }


  }

  getAllAdmin() {
    this.http
      .get<any[]>(`${this.baseUrl}/getAllAdmin`)
      .subscribe(
        (response) => {
          this.admins = response;
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
  }


  getMenuById(id: string, theme: string) {
    this.http
      .get<any[]>(`${this.baseUrl}/menu/${id}`)
      .subscribe(
        (response) => {

          this.menu = response;

          let nTheme = this.menu.theme.filter(function (item: { id: string; }) { return item.id === theme; });

          this.nTheme = nTheme[0].name;

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );

  }


  setViewMouse(id: string) {
    var height = $(window).height();

    const ifView = this.pView.find(element => element == id);

    if (ifView) {
      console.log('views')
    } else {
      this.pView.push(id);

      let fPost = this.posts.filter(function (item: { _id: string; }) { return item._id === id; });

      this.http
        .put<any[]>(`${this.baseUrl}/posts/setViews/${id}`, [id])
        .subscribe(
          (response) => {
            fPost[0].view = fPost[0].view + 1;
          },
          (error) => {
            console.log('Erreur ! : ' + error);
          }
        );

    }

  }

  setViewTouch(id: string) {
    var height = $(window).height();

    const ifView = this.pView.find(element => element == id);

    if (ifView) {
      console.log('views')
    } else {
      this.pView.push(id);
      console.log(this.pView)

      let fPost = this.posts.filter(function (item: { _id: string; }) { return item._id === id; });

      this.http
        .put<any[]>(`${this.baseUrl}/posts/setViews/${id}`, [id])
        .subscribe(
          (response) => {
            fPost[0].view = fPost[0].view + 1;
          },
          (error) => {
            console.log('Erreur ! : ' + error);
          }
        );

    }

  }


  URLReplacer(str: string) {

    let match = str.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
    let final = str;
    match?.map(url => {
      final = final.replace(url, "<a href=\"" + url + "\" target=\"_BLANK\">" + url + "</a>")
    })

    if (final) {
      return final
    } else {
      return str;
    }
    //console.log(final);
  }

}
