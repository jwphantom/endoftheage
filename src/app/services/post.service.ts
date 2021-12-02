import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { Subject } from 'rxjs';
import { Post } from '../model/post';
import { Comment } from '../model/comment';
import { HttpClient } from '@angular/common/http';

import { User } from '../model/user';
import DataSnapshot = firebase.database.DataSnapshot;
import { DatePipe } from '@angular/common';
import { Like } from '../model/like';
import { Socket } from 'ngx-socket-io';
import { GlobalConstants } from '../common/global-constants';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  post: any;
  posts: any;
  postsbycat: any;
  comments: any;
  commentsByGroup!: any[];
  countComments!: Number

  dataSource: any;

  postsSubject = new Subject<Post[]>();
  PostOneSubject = new Subject<Post[]>();


  postsByCatSubject = new Subject<Post[]>();


  commentsSubject = new Subject<Comment[]>();

  countCommentsSubject = new Subject<Number>();

  private baseUrl = GlobalConstants.apiURL;

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,  // NgZone service to remove outside scope warning
    private datePipe: DatePipe,
    private http: HttpClient,
    private socket: Socket

  ) {
    this.getPosts();
  }


  emitPosts() {
    this.postsSubject.next(this.posts);
  }

  emitOnePost() {
    this.PostOneSubject.next(this.post);
  }


  emitPostsByCat() {
    this.postsByCatSubject.next(this.postsbycat);
  }


  emitcomments() {
    this.commentsSubject.next(this.comments);
  }

  emitcountcomments() {
    this.countCommentsSubject.next(this.countComments);
  }

  savePosts() {
    firebase.database().ref('/posts').set(this.posts);


  }


  getPosts() {

    this.http
      .get<any[]>(`${this.baseUrl}/get-posts`)
      .subscribe(
        (response) => {

          this.posts = response;
          this.emitPosts();

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );

  }

  getPostsByCatTheme(cat: string, theme: string) {

    this.http
      .get<any[]>(`${this.baseUrl}/posts/${cat}/${theme}`)
      .subscribe(
        (response) => {


          if (response.length == 0) {
            $('#flash_message_theme_empty').show();

            setTimeout(() => {
              $('#flash_message_theme_empty').hide();
              this.router.navigate(['/endTime-menu']);

            }, 1500);


          } else {
            this.postsbycat = response;
            this.emitPostsByCat();
          }

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );

  }


  getSinglePosts(id: string) {
    this.http
      .get<any[]>(`${this.baseUrl}/post/${id}`)
      .subscribe(
        (response) => {
          this.post = response;
          this.emitOnePost();

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );

  }

  createNewPost(newPost: Post, menu: any) {


    const Data = [newPost, menu]


    this.http
      .post(this.baseUrl + '/create-post', Data)
      .subscribe(
        (res) => {

          $('#flash_message_success').show();

          setTimeout(function () {
            $('#flash_message_success').hide();
          }, 5000);
          this.socket.emit('get-posts-afterCreate', newPost);

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );


  }

  updatePost(post: any, menu:any, id: string) {

    const Data = [post, menu]

    this.http
      .put(this.baseUrl + `/update-post/${id}`, Data)
      .subscribe(
        (res) => {

          $('#flash_message_update_comments').show();

          setTimeout(function () {
            $('#flash_message_update_comments').hide();
          }, 5000);

          this.router.navigate(['/post'])



        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );


  }



  deletePost(id: String) {

    var user = firebase.auth().currentUser;

    if (user) {
      this.http
        .delete<any[]>(`${this.baseUrl}/del-posts/${id}`)
        .subscribe(
          (response) => {

            $('#flash_message_delete').show();

            setTimeout(function () {
              $('#flash_message_delete').hide();
            }, 5000);
            this.socket.emit('get-posts-afterDelete', id);


          },
          (error) => {
            console.log('Erreur ! : ' + error);
          }
        );

    }
    else {
      $('#flash_message_notGranted').show();

      setTimeout(function () {
        $('#flash_message_notGranted').hide();
      }, 5000);

    }


  }

  sendComment(comment: string, post: Post, _id: string) {

    const id = this.afs.createId()

    let ucomment: any[];

    var user = firebase.auth().currentUser;



    if (post.comments && post.comments.length > 0) {

      let commentData = {
        uid: id,
        pseudo: localStorage.getItem('pseudo')!,
        email: user?.email,
        comment: comment,
        create_date: this.datePipe.transform(Date.now(), 'yyyy-MM-dd HH:mm:ss a'),
        timestamp: Date.now()
      }

      // console.log(ucomment);
      // console.log(commentData);


      let oldPost = post.comments;

      let nPost = oldPost.slice();

      nPost.push(commentData);


      ucomment = nPost;


    }
    else {

      let commentData = {
        uid: id,
        pseudo: localStorage.getItem('pseudo')!,
        email: user?.email,
        comment: comment,
        create_date: this.datePipe.transform(Date.now(), 'yyyy-MM-dd HH:mm:ss a'),
        timestamp: Date.now()
      }

      ucomment = [commentData];

    }

    //this.socket.emit('update-comment', [ucomment, _id]);


    this.http
      .put(this.baseUrl + `/comment-post/${_id}`, ucomment)
      .subscribe(
        (res) => {
          this.socket.emit('update-comment', [ucomment, _id]);

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );

  }

  sendLike(post: Post, _id: string) {

    const id = this.afs.createId();

    var user = firebase.auth().currentUser;

    let ulike: any;

    let oldLike = post.likes;

    let nLike = oldLike?.slice();

    let isNLike = nLike?.filter(function (item: { pseudo: string; }) { return item.pseudo === user?.email; });

    if (isNLike?.length == 0) {

      let likeData = {
        uid: id,
        pseudo: user?.email!,
      }
      let nLike = oldLike?.slice();
      nLike?.push(likeData);
      ulike = nLike;
    } else {
      for (let [i, nL] of nLike!.entries()) {
        if (nL.pseudo == user?.email) {
          nLike?.splice(i, 1);
        }
      }
      ulike = nLike;

    }


    // if (!post.likes || post.likes.length == 0) {
    //   let likeData = {
    //     uid: id,
    //     pseudo: user?.email,
    //   }

    //   ulike = likeData;
    //   //post.likes = [ulike];
    //   //this.afs.doc(`posts/${post.uid}`).update({ likes: ulike });


    // } else {

    //   if (post.likes.length > 1) {

    //     let oldLike = post.likes;
    //     let nLike = oldLike.slice();

    //     let isNLike = nLike.filter(function (item: { pseudo: string; }) { return item.pseudo === user?.email; });

    //     if (isNLike.length == 0) {

    //       let likeData = {
    //         uid: id,
    //         pseudo: user?.email!,
    //       }
    //       let nLike = oldLike.slice();
    //       nLike.push(likeData);
    //       ulike = nLike;
    //     } else {
    //       for (let [i, nL] of nLike.entries()) {
    //         if (nL.pseudo == user?.email) {
    //           nLike.splice(i, 1);
    //         }
    //       }
    //       ulike = nLike;

    //     }


    //   }
    //   else {
    //     for (let i = 0; i < post.likes!.length; i++) {

    //       for (let j = 0; j < this.posts[i].likes.length; j++)


    //         if (this.posts[i].likes[j].pseudo == user?.email) {
    //           ulike = this.posts[i].likes[j];
    //           //this.posts[i].likes.splice(j,1);
    //         } else {
    //           let likeData = {
    //             uid: id,
    //             pseudo: user?.email!,
    //           }
    //           let oldLike = post.likes;
    //           let nLike = oldLike.slice();
    //           nLike.push(likeData);
    //           ulike = nLike;
    //         }

    //     }
    //   }
    // }






    //this.socket.emit('update-like', [ulike, _id, user?.email]);

    this.http
      .put(this.baseUrl + `/like-post/${_id}`, ulike)
      .subscribe(
        (res) => {
          this.socket.emit('update-like', [ulike, _id, localStorage.getItem('email')]);
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );

  }

  deleteComment(comments: any, pId: any, i: number) {

    comments.splice(i, 1);
    this.http
      .put(this.baseUrl + `/del-comment/${pId}`, comments)
      .subscribe(
        (res) => {

          $('#flash_message_delete_comments').show();

          setTimeout(function () {
            $('#flash_message_delete_comments').hide();
          }, 5000);

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );


  }





}




