import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { Subject } from 'rxjs';
import { Post } from '../model/post';
import { Comment } from '../model/comment';

import { User } from '../model/user';
import DataSnapshot = firebase.database.DataSnapshot;
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  posts: any;
  comments : any;
  dataSource: any;

  postsSubject = new Subject<Post[]>();

  commentsSubject = new Subject<Comment[]>();

  


  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,  // NgZone service to remove outside scope warning
    private datePipe: DatePipe,

  ) {
    this.getPosts();
    this.getComments();
  }


  emitPosts() {
    this.postsSubject.next(this.posts);
  }


  emitcomments() {
    this.commentsSubject.next(this.comments);
  }

  savePosts() {
    firebase.database().ref('/posts').set(this.posts);


  }


  getPosts() {

    this.afs.collection('posts', ref => ref.orderBy('timestamp', 'desc')).snapshotChanges().subscribe((data) => {
      this.posts = data.map(item =>
        Object.assign({ id: item.payload.doc.id }, item.payload.doc.data())
      );
      this.emitPosts();
    })
  }

  getComments() {

    this.afs.collection('comments', ref => ref.orderBy('timestamp', 'desc')).snapshotChanges().subscribe((data) => {
      this.comments = data.map(item =>
        Object.assign({ id: item.payload.doc.id }, item.payload.doc.data())
      );
      this.emitcomments();
    })
  }

  getSinglePosts(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/posts/' + id).once('value').then(
          (data: DataSnapshot) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  createNewPost(newPost: Post) {
    console.log(newPost);
    this.posts.push(newPost);
    this.savePosts();
    this.emitPosts();
  }

  deletePost(uid: String) {

    this.afs.doc(`posts/${uid}`).delete();

    $('#flash_message_delete').show();

    setTimeout(function () {
      $('#flash_message_delete').hide();
    }, 5000);

  }

  sendComment(comment: string, postId: string) {

    const id = this.afs.createId()

    const commentRef: AngularFirestoreDocument<any> = this.afs.doc(`comments/${id}`);


    const commentData: Comment = {
      uid: id,
      postId: postId,
      pseudo: 'Ano',
      comment: comment,
      create_date: this.datePipe.transform(Date.now(), 'yyyy-MM-dd HH:mm:ss a'),
      timestamp: Date.now()

    }

    return commentRef.set(commentData, {
      merge: true

    });


  }


}
