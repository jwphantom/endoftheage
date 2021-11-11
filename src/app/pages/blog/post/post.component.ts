import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PublishComponent } from 'src/app/static/publish/publish.component';
import { MatDialog } from '@angular/material/dialog';
import { AddpostComponent } from '../../modal/addpost/addpost.component';
import { Post } from 'src/app/model/post';
import { Comment } from 'src/app/model/comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, observable, Subject, Subscriber, Subscription } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/authservice.service';
import getMAC, { isMAC } from 'getmac'
import { AngularFirestore } from '@angular/fire/firestore';
import { data, post } from 'jquery';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {



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

  countLike!: number;


  @ViewChild(AddpostComponent) child: any;

  private auth: Boolean = false;

  commentForm!: FormGroup;
  pseudoUser = localStorage.getItem('pseudo');




  constructor(private title: Title,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private postService: PostService,
    private authService: AuthService,
    public afs: AngularFirestore,
    private socket: Socket  // Inject Firestore service

  ) { }

  ngOnInit() {

    this.title.setTitle("EndOfTheAge - Post");

    if (localStorage.getItem('email')) {
      this.authcomment = true
    } else {
      this.authcomment = false;

    }

    //this.posts = this.postService.getPosts().valueChanges();


    this.storePost();

    this.upPostafterCreate();
    this.upPostafterDelete();
    this.upComment();
    this.upLike();
    this.addCommentForm()

    this.upPseudoCreate();


    this.loadScript('../assets/js/plugins.js');
    this.loadScript('../assets/js/mobilemenu.js');
    this.loadScript('../assets/js/main.js');
    this.loadScript('../assets/js/vendor/jquery-3.5.1.min.js');
    this.loadScript('../assets/js/vendor/jquery-migrate-3.3.0.min.js');
    this.loadScript('../assets/js/vendor/bootstrap.min.js');

  }

  addCommentForm() {
    this.commentForm = this.formBuilder.group({
      pcomment: ['', Validators.required],
    });
  }


  storePost() {
    this.postsSubscription = this.postService.postsSubject.subscribe(
      (posts: Post[]) => {
        this.posts = posts;
      }
    );

    this.postService.emitPosts();
  }

  upPseudoCreate() {

    this.socket.on(`get-update-pseudo`, (email: any) => {

      if (localStorage.getItem('email') == email.email[0]) {
        this.authcomment = true
      } else {
        this.authcomment = false;

      }
    })

  }


  upPostafterCreate() {
    this.socket.on('send-posts-afterCreate', (newPost: any) => {

      this.posts.push(newPost['newPost']);

      this.postService.emitPosts();
    })

  }

  upPostafterDelete() {
    this.socket.on('send-posts-afterDelete', (id: any) => {

      for (let i = 0; i < this.posts.length; i++) {
        if (this.posts[i]._id == id.id) {
          console.log(this.posts[i])
          this.posts.splice(i, 1)
        }
      }

      this.postService.emitPosts();
    })

  }


  upComment() {
    this.socket.on('get-update-comment', (comment: any) => {


      for (let i = 0; i < this.posts.length; i++) {
        if (this.posts[i]._id == comment.comment[1]) {
          if (this.posts[i].comments && this.posts[i].comments.length > 0) {


            let commentData = {
              uid: comment.comment[0][comment.comment[0].length - 1].uid,
              pseudo: comment.comment[0][comment.comment[0].length - 1].pseudo,
              comment: comment.comment[0][comment.comment[0].length - 1].comment,
              create_date: comment.comment[0][comment.comment[0].length - 1].create_date,
              timestamp: comment.comment[0][comment.comment[0].length - 1].timestamp
            }


            this.posts[i].comments.push(commentData)

          }
          else {

            let commentData = {
              uid: comment.comment[0][0].uid,
              pseudo: comment.comment[0][0].pseudo,
              comment: comment.comment[0][0].comment,
              create_date: comment.comment[0][0].create_date,
              timestamp: comment.comment[0][0].timestamp
            }

            this.posts[i].comments = [commentData]

          }

        }
      }

    })

  }

  upLike() {

    if (localStorage.getItem('email')) {

      this.socket.on(`get-update-like-${localStorage.getItem('email')}`, (like: any) => {
        let ulike: any | undefined;
        if (like.like[0].length > 1) {

          if (like.like[0][like.like[0].length - 1].pseudo == localStorage.getItem('email')) {

            let found = this.posts.filter(function (item: { _id: string; }) { return item._id === like.like[1]; });
            found[0].likes.push(like.like[0][like.like[0].length - 1])
          }
        }
        else {
          for (let i = 0; i < this.posts.length; i++) {

            if (this.posts[i]._id == like.like[1]) {


              if (!this.posts[i].likes || this.posts[i].likes.length == 0) {
                let likeData = {
                  uid: like.like[0].uid,
                  pseudo: like.like[0].pseudo,
                }

                ulike = likeData;
                this.posts[i].likes = [ulike];

              } else {

                for (let j = 0; j < this.posts[i].likes.length; j++) {
                  if (this.posts[i].likes[j].pseudo == like.like[0].pseudo) {
                    this.posts[i].likes.splice(j, 1);
                    //console.log(like.like[0].pseudo)
                  }
                }
              }
            }
          }
        }
      })
    }

  }

  storeCountLike() {

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

  onCommentChange(event: any) {


  }

  sendComment(post: Post, id: string) {

    const comment = this.commentForm.get('pcomment')?.value;


    if (comment.length == 0) {
      $('#flash_message_comment_empty').show();

      setTimeout(function () {
        $('#flash_message_comment_empty').hide();
      }, 5000);


    } else {
      console.log(comment.length);

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


  like(post: Post, _id: string) {

    this.postService.sendLike(post, _id);

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

}
