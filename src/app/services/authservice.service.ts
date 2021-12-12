import { Injectable, NgZone } from '@angular/core';
import { User } from "../model/user";
import { Pseudo } from "../model/pseudo";

import firebase from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { GlobalConstants } from '../common/global-constants';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private baseUrl = GlobalConstants.apiURL;


  userData: any; // Save logged in user data


  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private socket: Socket,
    private http: HttpClient,



  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user') || '{}');
      } else {
        localStorage.setItem('user', '{}');
        JSON.parse(localStorage.getItem('user') || '{}');
      }
    })
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['post']);
        });
        this.SetUserData(result.user);
      }).catch((error) => {
        $('#NSubmitForm').show();
        $('#submitForm').hide();
        window.alert(error.message)
      })
  }

  NewSignIn(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.socket.emit('send_flash_message_success_auth', { email: email });
          this.router.navigate(['post']);
        });
        this.SetUserData(result.user);
        console.log(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return firebase.auth().currentUser?.sendEmailVerification()
      .then(() => {
        this.router.navigate(['verify-email-address']);
      })
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return firebase.auth().sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error)
      })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = firebase.auth().currentUser;
    return (user !== null) ? true : false;
  }

  getisLogged() {

    const user = firebase.auth().currentUser;
    return (user !== null) ? true : false;

  }

  getIsAdmin() {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.http
          .get<any[]>(`${this.baseUrl}/getAdmin/${user?.email}`)
          .subscribe(
            (response) => {
              localStorage.setItem('pseudo', response[0].pseudo);
              localStorage.setItem('email', response[0].email);
              localStorage.setItem('role', response[0].role);
            },
            (error) => {
              console.log('Erreur ! : ' + error);
            }
          );

      }
    })



    //return (user !== null) ? true : false;

  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return firebase.auth().signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['post']);
        })
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error)
      })
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign out 
  SignOut() {
    return firebase.auth().signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.setItem('pseudo', 'anonyme');
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      this.router.navigate(['/sign-in']);
    })
  }

  storePseudo(email: string, pseudo: string) {


    localStorage.setItem('pseudo', pseudo);
    localStorage.setItem('email', email);


    this.socket.emit('update-pseudo', [email]);

  }

  getPseudo() {
    let pesudoLocal = localStorage.getItem('pseudo');
    return pesudoLocal;
  }


  async SignUp(pseudo: any, email: any) {

    $('#bricks').hide();
    $('#loading').css('visibility', 'visible');

    var user = {
      email: email,
      pseudo: pseudo,
      role: 'user',
    };

    this.http
      .post(`${this.baseUrl}/user/register`, user)
      .subscribe(
        (response: any) => {


          var templateParams = {
            email: email,
            password: response['cred']
          };

          emailjs.send('service_end_of_the_age', 'template_b200vbv', templateParams, 'user_SZkYtq4YKmK5GGrGDmP4s')
            .then((r) => {

              console.log('SUCCESS!', r.status, r.text);
              localStorage.setItem('pseudo', pseudo);
              localStorage.setItem('email', email);
              localStorage.setItem('role', 'user');
              $('#loading').css('visibility', 'hidden');
              $('#bricks').show();
              this.NewSignIn(email, response['cred']);

            }, function (err) {
              console.log('FAILED...', err);
            });


        },
        (error) => {
          console.log('Erreur ! : ' + error);
          $('#NSubmitForm').show();
          $('#submitForm').hide();
          //loading.dismiss();

        }
      );

  }


}