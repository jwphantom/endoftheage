import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../model/post';
import { NgZone } from '@angular/core';
import firebase from 'firebase';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../../../common/global-constants';


@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.scss']
})
export class AddpostComponent implements OnInit {

  private baseUrl = GlobalConstants.apiURL;



  @Input() section_o!: Boolean;

  close_section: Boolean | undefined;

  message: Boolean = false;

  @Output() messageEvent = new EventEmitter<Boolean>();


  img_url: string = '';

  audio_url: string = '';

  video_url: string = '';

  pdf_url: string = '';


  currentDate = new Date();

  lMenu: any;

  ifCreateTheme: boolean = false;


  s_aImage: Boolean = false;
  s_aAudio: Boolean = false;
  s_aVideo: Boolean = false;
  s_aPdf: Boolean = false;

  b_aImage: Boolean = true;
  b_aAudio: Boolean = true;
  b_aVideo: Boolean = true;
  b_aPdf: Boolean = true;


  type: string = "";

  theme: string = "";
  cTheme: Boolean = false;
  lTheme: any;


  postForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,
    private datePipe: DatePipe,
    private http: HttpClient,

  ) { }

  ngOnInit() {

    this.addPostForm();
    console.log(this.section_o);
    this.getMenu();


  }

  close() {
    this.close_section = false;
    this.messageEvent.emit(this.message);

  }

  getMenu() {
    this.http
      .get<any[]>(`${this.baseUrl}/menu`)
      .subscribe(
        (response) => {


          this.lMenu = response;

          if(this.lMenu.length == 0){
            this.close();
            $('.menuEmpty').show();

            setTimeout(function () {
              $('.menuEmpty').hide();
            }, 5000);
          }
          else{
            this.type = this.lMenu[0]._id;
            this.lTheme = this.lMenu[0].theme;
          }
          
          //this.theme = response[0].name;

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );

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

  addPostForm() {
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      theme: ['', Validators.required],
      type: ['', Validators.required],
      img_url: [''],
      audio_url: [''],
      video_url: [''],
      pdf_url: ['']
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
    const theme = this.postForm.get('theme')?.value.toLowerCase();
    const type = this.postForm.get('type')?.value;
    const audio_url = this.postForm.get('audio_url')?.value;
    const img_url = this.postForm.get('img_url')?.value;
    const video_url = this.postForm.get('video_url')?.value;
    const pdf_url = this.postForm.get('pdf_url')?.value;


    var user = firebase.auth().currentUser;


    if (this.cTheme == true) {

      let idTheme = this.afs.createId();

      const postData: Post = {
        title: title,
        content: content,
        theme: idTheme,
        type: type,
        author : user!.email,
        img_url: img_url,
        audio_url: audio_url,
        view : 1,
        video_url: video_url,
        pdf_url: pdf_url,
        comments: [],
        likes: [],
        create_date: this.datePipe.transform(Date.now(), 'yyyy-MM-dd HH:mm:ss a'),
        timestamp: Date.now()

      }

      let menu = this.lMenu?.slice();

      menu = this.lMenu.filter(function (item: { _id: string; }) { return item._id === type; });

      const ctheme = {
        id : idTheme,
        name : theme
      };

      menu[0].theme.push(ctheme);

      if (postData) {
        this.close();
        this.postService.createNewPost(postData, menu[0]);
  
      }

    }
    else{
      this.close();
      const postData: Post = {
        title: title,
        content: content,
        theme: theme,
        type: type,
        author : user!.email,
        img_url: img_url,
        view : 1,
        audio_url: audio_url,
        video_url: video_url,
        pdf_url: pdf_url,
        comments: [],
        likes: [],
        create_date: this.datePipe.transform(Date.now(), 'yyyy-MM-dd HH:mm:ss a'),
        timestamp: Date.now()

      }

      console.log(postData);

      this.postService.createNewPost(postData,'notNewTheme');

    }

  }

  getValueTheme(event: any) {
    console.log(event.target.value);

    if (event.target.value == 'create') {
      this.cTheme = true;
      this.postForm.controls['theme'].setValue('');

    } else {
      this.cTheme = false;
    }
  }

  getValueMenu(event: any) {
    console.log(event.target.value);
    let id = event.target.value
    let menu = this.lMenu.filter(function (item: { _id: string; }) { return item._id === id; });
    this.lTheme = menu[0].theme;

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
