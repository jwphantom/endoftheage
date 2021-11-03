import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../model/post';
import { NgZone } from '@angular/core';

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.scss']
})
export class AddpostComponent implements OnInit {

  @Input() section_o!: Boolean;

  close_section: Boolean | undefined;

  message: Boolean = false;

  @Output() messageEvent = new EventEmitter<Boolean>();


  img_url!: string;

  audio_url!: string;

  currentDate = new Date();



  s_aImage: Boolean = false;
  s_aAudio: Boolean = false;

  postForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private postService: PostService,
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,
    private datePipe: DatePipe,
    ) { }

  ngOnInit() {

    this.addPostForm();
    console.log(this.section_o);
  }

  close() {
    this.close_section = false;
    this.messageEvent.emit(this.message);

  }

  o_s_aImage() {
    this.s_aImage = !this.s_aImage;
  }

  o_s_aAudio() {
    this.s_aAudio = !this.s_aAudio;
  }

  addPostForm() {
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      img_url: ['', Validators.required],
      audio_url: ['', Validators.required]
    });
  }

  onSavePost() {
    const title = this.postForm.get('title')?.value;
    const content = this.postForm.get('content')?.value;
    const audio_url = this.postForm.get('audio_url')?.value;
    const img_url = this.postForm.get('img_url')?.value;
    

    //const post =  new Post(title,content,audio_url,img_url);
    //this.postService.createNewPost(post);

    // this.router.navigate(['/post']);

    const id = this.afs.createId()

    const postRef: AngularFirestoreDocument<any> = this.afs.doc(`posts/${id}`);
    const postData: Post = {
      uid: id,
      title: title,
      content: content,
      img_url: img_url,
      audio_url: audio_url,
      create_date : this.datePipe.transform(Date.now(), 'yyyy-MM-dd HH:mm:ss a'),
      timestamp : Date.now()
      
    }

    if (postRef) {
      this.close();
      
      $('#flash_message_success').show();

      setTimeout(function () {
        $('#flash_message_success').hide();
      }, 5000);

    }

    return postRef.set(postData, {
      merge: true

    });


  }

}
