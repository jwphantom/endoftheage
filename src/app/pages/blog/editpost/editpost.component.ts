import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../model/post';
import { NgZone } from '@angular/core';

import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from "@angular/router";
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.component.html',
  styleUrls: ['./editpost.component.scss']
})
export class EditpostComponent implements AfterViewInit {

  private baseUrl = 'https://server-endoftheage.herokuapp.com/api';
  //private baseUrl = 'http://localhost:3001/api';

  public id!: string;

  display: boolean = false;


  post: any;
  postOneSubscription: Subscription | undefined;



  @Input() section_o!: Boolean;

  close_section: Boolean | undefined;


  img_url: string = '';

  audio_url: string = '';

  video_url: string = '';

  pdf_url: string = '';


  currentDate = new Date();

  postForm!: FormGroup;


  s_aImage: Boolean = false;
  s_aAudio: Boolean = false;
  s_aVideo: Boolean = false;
  s_aPdf: Boolean = false;

  b_aImage: Boolean = true;
  b_aAudio: Boolean = true;
  b_aVideo: Boolean = true;
  b_aPdf: Boolean = true;

  type!: string;

  theme!: string;
  cTheme: Boolean = false;
  lTheme: any;

  constructor(private formBuilder: FormBuilder,
    private postService: PostService,
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private http: HttpClient,


  ) { }

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id')!;


    this.postService.getSinglePosts(this.id);
    this.storeOnePost();
    this.getTheme();
  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.display = true;
      this.editPostForm(this.post);

    }, 1000);

  }


  close() {
    this.close_section = false;
    //this.messageEvent.emit(this.message);

  }

  o_s_aImage() {
    this.s_aImage = !this.s_aImage;
  }

  o_s_aAudio() {
    this.s_aAudio = !this.s_aAudio;
  }

  o_s_Video() {
    this.s_aVideo = !this.s_aVideo;
  }

  o_s_Pdf() {
    this.s_aPdf = !this.s_aPdf;
  }

  editPostForm(post: any) {

    this.type = post.type;

    this.theme = post.theme;

    this.img_url = post.img_url;

    this.audio_url = post.audio_url;

    this.video_url = post.video_url;

    this.pdf_url = post.pdf_url;

    this.postForm = this.formBuilder.group({
      title: [post.title, Validators.required],
      content: [post.content, Validators.required],
      type: [post.type, Validators.required],
      theme: [post.theme, Validators.required],
      img_url: [post.img_url],
      audio_url: [post.audio_url],
      video_url: [post.video_url],
      pdf_url: [post.pdf_url]
    });
  }


  onAudioUrlChange(event: any) {


    if (event.target.value.length >= 1) {
      this.b_aPdf = false
      this.b_aVideo = false
    } else {
      this.b_aPdf = true
      this.b_aVideo = true
    }

  }

  onImageUrlChange(event: any) {


    if (event.target.value.length >= 1) {
      this.b_aPdf = false
      this.b_aVideo = false
    } else {
      this.b_aPdf = true
      this.b_aVideo = true
    }

  }

  onVideoUrlChange(event: any) {

    if (event.target.value.length >= 1) {
      this.b_aAudio = false
      this.b_aPdf = false
      this.b_aImage = false

    } else {
      this.b_aAudio = true
      this.b_aPdf = true
      this.b_aImage = true
    }

  }

  onPdfUrlChange(event: any) {


    if (event.target.value.length >= 1) {
      this.b_aAudio = false
      this.b_aVideo = false
      this.b_aImage = false

    } else {
      this.b_aAudio = true
      this.b_aVideo = true
      this.b_aImage = true
    }

  }

  onSavePost() {
    const title = this.postForm.get('title')?.value;
    const content = this.postForm.get('content')?.value;
    const theme = this.postForm.get('theme')?.value;
    const type = this.postForm.get('type')?.value;
    const audio_url = this.postForm.get('audio_url')?.value;
    const img_url = this.postForm.get('img_url')?.value;
    const video_url = this.postForm.get('video_url')?.value;
    const pdf_url = this.postForm.get('pdf_url')?.value;


    const postData: Post = {
      title: title,
      content: content,
      type: type,
      theme: theme,
      img_url: img_url,
      audio_url: audio_url,
      video_url: video_url,
      pdf_url: pdf_url,
      comments: null,
      likes: null,
      create_date: this.datePipe.transform(Date.now(), 'yyyy-MM-dd HH:mm:ss a'),
      timestamp: Date.now()

    }

    if (postData) {
      this.close();
      this.postService.updatePost(postData, this.id);

    }

    // return postRef.set(postData, {
    //   merge: true

    // });


  }

  storeOnePost() {
    this.postOneSubscription = this.postService.PostOneSubject.subscribe(
      (post: Post[]) => {
        this.post = post;
      }
    );
    this.postService.emitOnePost();
  }

  getValueTheme(event: any) {
    console.log(event.target.value);

    if (event.target.value == 'create') {
      this.theme = '';
      this.cTheme = true;
    } else {
      this.cTheme = false;
    }
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


}
