import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private baseUrl = 'https://server-endoftheage.herokuapp.com/api';
  //private baseUrl = 'http://localhost:3001/api';


  currentUser: any = [];


  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,  // NgZone service to remove outside scope warning
    private datePipe: DatePipe,
    private http: HttpClient,
    private socket: Socket

  ) { }


  async updatePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {

    const user = firebase.auth().currentUser;

    this.currentUser = user;

    const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      oldPassword
    );
    try {
      await this.currentUser.reauthenticateWithCredential(credential);
      $('#flash_message_success_uPassword').show();

      setTimeout(() => {
        $('#flash_message_success_uPassword').hide();

      }, 3000);
      return this.currentUser.updatePassword(newPassword);


    } catch (error) {
      $('#flash_message_notGranted').show();

      setTimeout(() => {
        $('#flash_message_notGranted').hide();

      }, 3000);
      console.error(error);
    }
  }


  async updatePseudo(
    pseudo: string
  ): Promise<void> {

    const ps = { pseudo: pseudo };

    const user = firebase.auth().currentUser;


    this.http
      .put(this.baseUrl + `/update-pseudo/${user?.email}`, ps)
      .subscribe(
        (res) => {
          localStorage.setItem('pseudo', pseudo);

          $('#loading').css('visibility', 'hidden');
          $('#bricks').show();
          $('#flash_message_success_uPseudo').show();

          setTimeout(() => {
            $('#flash_message_success_uPseudo').hide();

          }, 3000);


        },
        (error) => {
          $('#flash_message_notGranted').show();

          setTimeout(() => {
            $('#flash_message_notGranted').hide();

          }, 3000);
          console.log('Erreur ! : ' + error);
        }
      );

    console.log(pseudo);



  }

}


