import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PublishComponent } from 'src/app/static/publish/publish.component';
import { MatDialog } from '@angular/material/dialog';
import { AddpostComponent } from '../../modal/addpost/addpost.component';
import { Post } from 'src/app/model/post';
import { Comment } from 'src/app/model/comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { AuthService } from 'src/app/services/authservice.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../../../common/global-constants';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements AfterViewInit {


  private baseUrl = GlobalConstants.apiURL;
  closeResult = '';

  s_aPost: Boolean = false;

  message: string | undefined;


  //posts!: Post[];
  postsSubscription!: Subscription;


  comments!: Comment[];
  commentsSubscription!: Subscription;

  pcomment!: string;

  authcomment: Boolean = false;

  pseudo: string = '';

  public posts: any;
  public postsAll: any;


  countLike!: number;

  admins: any;

  pView: Array<string> = [];

  sliceProduct: number = 1;

  lengthProduct! : number;


  @ViewChild(AddpostComponent) child: any;

  private auth: Boolean = false;

  commentForm!: FormGroup;
  emailUser = localStorage.getItem('email');
  roleUser = localStorage.getItem('role');
  pseudoUser = localStorage.getItem('pseudo');




  constructor(private title: Title,
    public dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private postService: PostService,
    private authService: AuthService,
    public afs: AngularFirestore,
    private http: HttpClient,
    private socket: Socket,  // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service

  ) { }

  ngOnInit() {



    this.title.setTitle("EndOfTheAge - Post");

    this.authcomment = this.authService.getisLogged();

    this.storePost();

    this.upPostafterCreate();
    this.upPostafterDelete();
    this.upComment();
    this.addCommentForm()

    this.upPseudoCreate();
    this.flash_message_success_auth();
    this.getAllAdmin();

    this.loadScript('../assets/js/plugins.js');
    this.loadScript('../assets/js/mobilemenu.js');
    this.loadScript('../assets/js/main.js');
    this.loadScript('../assets/js/vendor/jquery-3.5.1.min.js');
    this.loadScript('../assets/js/vendor/jquery-migrate-3.3.0.min.js');
    this.loadScript('../assets/js/vendor/bootstrap.min.js');

  }

  ngAfterViewInit() {
    this.upLike();

  }

  addCommentForm() {
    this.commentForm = this.formBuilder.group({
      pcomment: ['', Validators.required],
    });
  }


  storePost() {
    this.posts = [];

    this.postsSubscription = this.postService.postsSubject.subscribe(
      (posts: Post[]) => {
        this.lengthProduct = posts.length;
        this.postsAll = posts
        this.posts = this.postsAll.slice(0, this.sliceProduct);
      }
    );

    this.postService.getPosts();
  }


  flash_message_success_auth() {

    this.socket.on(`get_flash_message_success_auth`, (email: any) => {

      this.afAuth.authState.subscribe(user => {
        if (user?.email == email.email.email) {
          $('#flash_message_success_auth').show();

          setTimeout(function () {
            $('#flash_message_success_auth').hide();
          }, 5000);

          this.emailUser = localStorage.getItem('email');
          this.roleUser = localStorage.getItem('role');
          this.pseudoUser = localStorage.getItem('pseudo');
          this.authcomment = this.authService.getisLogged();;

        }
      });



    })


  }

  upPseudoCreate() {

    this.socket.on(`get-update-pseudo`, (email: any) => {

      if (localStorage.getItem('email') == email.email[0]) {
        this.authcomment = this.authService.getisLogged();
      } else {
        this.authcomment = false;


      }
    })

  }


  upPostafterCreate() {
    this.socket.on('send-posts-afterCreate', (newPost: any) => {

      this.posts.unshift(newPost['newPost']);
    })

  }

  upPostafterDelete() {
    this.socket.on('send-posts-afterDelete', (id: any) => {

      for (let i = 0; i < this.posts.length; i++) {
        if (this.posts[i]._id == id.id) {
          this.posts.splice(i, 1)
        }
      }

      this.postService.emitPosts();
    })

  }


  upComment() {
    this.socket.on('get-update-comment', (comment: any) => {


      let sPost = this.posts.filter(function (item: { _id: string; }) { return item._id === comment.comment[1] });

      sPost[0].comments.push(comment.comment[0].at(-1))

      // let commentData = {
      //   uid: comment.comment[0][comment.comment[0].length - 1].uid,
      //   pseudo: comment.comment[0][comment.comment[0].length - 1].pseudo,
      //   comment: comment.comment[0][comment.comment[0].length - 1].comment,
      //   email: comment.comment[0][comment.comment[0].length - 1].email,
      //   create_date: comment.comment[0][comment.comment[0].length - 1].create_date,
      //   timestamp: comment.comment[0][comment.comment[0].length - 1].timestamp
      // }

      // sPost[0].comments.push(commentData)

      // console.log(sPost);

      // for (let i = 0; i < this.posts.length; i++) {
      //   if (this.posts[i]._id == comment.comment[1]) {
      //     if (this.posts[i].comments && this.posts[i].comments.length > 0) {


      //       let commentData = {
      //         uid: comment.comment[0][comment.comment[0].length - 1].uid,
      //         pseudo: comment.comment[0][comment.comment[0].length - 1].pseudo,
      //         comment: comment.comment[0][comment.comment[0].length - 1].comment,
      //         email: comment.comment[0][comment.comment[0].length - 1].email,
      //         create_date: comment.comment[0][comment.comment[0].length - 1].create_date,
      //         timestamp: comment.comment[0][comment.comment[0].length - 1].timestamp
      //       }


      //       this.posts[i].comments.push(commentData)

      //     }
      //     else {

      //       let commentData = {
      //         uid: comment.comment[0][0].uid,
      //         pseudo: comment.comment[0][0].pseudo,
      //         email: comment.comment[0][0].email,
      //         comment: comment.comment[0][0].comment,
      //         create_date: comment.comment[0][0].create_date,
      //         timestamp: comment.comment[0][0].timestamp
      //       }

      //       this.posts[i].comments = [commentData]

      //     }

      //   }
      // }

    })

  }

  upLike() {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        if (user.email) {

          this.socket.on(`get-update-like`, (like: any) => {

            let ulike: any | undefined;

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

  ePost(uid: string) {
    this.router.navigate(['/post/edit', uid])
  }

  onCommentChange(event: any) {


  }

  sendComment(post: Post, id: string) {

    const comment = this.commentForm.get('pcomment')?.value;

    var user = firebase.auth().currentUser;

    if (user) {
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
    else {
      $('#user_not_auth').show();

      setTimeout(function () {
        $('#user_not_auth').hide();
      }, 5000);
    }

  }


  like(post: Post, _id: string) {

    var user = firebase.auth().currentUser;

    if (user) {
      this.postService.sendLike(post, _id);
    }


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


  setViewMouse(id: string) {
    // var height = $(window).height();

    // const ifView = this.pView.find(element => element == id);

    // if (ifView) {
    // } else {
    //   this.pView.push(id);

    //   let fPost = this.posts.filter(function (item: { _id: string; }) { return item._id === id; });

    //   this.http
    //     .put<any[]>(`${this.baseUrl}/posts/setViews/${id}`, [id])
    //     .subscribe(
    //       (response) => {
    //         fPost[0].view = fPost[0].view + 1;
    //       },
    //       (error) => {
    //         console.log('Erreur ! : ' + error);
    //       }
    //     );

    // }

  }

  setViewTouch(id: string) {
    // var height = $(window).height();

    // const ifView = this.pView.find(element => element == id);

    // if (ifView) {
    // } else {
    //   this.pView.push(id);

    //   let fPost = this.posts.filter(function (item: { _id: string; }) { return item._id === id; });

    //   this.http
    //     .put<any[]>(`${this.baseUrl}/posts/setViews/${id}`, [id])
    //     .subscribe(
    //       (response) => {
    //         fPost[0].view = fPost[0].view + 1;
    //       },
    //       (error) => {
    //         console.log('Erreur ! : ' + error);
    //       }
    //     );

    // }

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


  readmore(idPost: string) {
    $(`.sContent-${idPost}`).hide();
    $(`.fContent-${idPost}`).show();

  }

  minimize(idPost: string) {
    $(`.sContent-${idPost}`).show();
    $(`.fContent-${idPost}`).hide();

  }

  addSlice(){
    this.sliceProduct = this.sliceProduct + 4;
    this.posts = this.postsAll.slice(0, this.sliceProduct);
    console.log(this.sliceProduct);
  }



}
