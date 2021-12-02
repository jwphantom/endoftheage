import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Title } from '@angular/platform-browser';
import { SettingsService } from 'src/app/services/settings.service';
import firebase from 'firebase';
import { GlobalConstants } from '../../common/global-constants';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  private baseUrl = GlobalConstants.apiURL;


  lTheme: any;
  lMenu: any;

  submitPassword: boolean = false;
  submitPseudo: boolean = false;
  submitEndMenu: boolean = false;

  currentUser: any = [];

  ps: string | undefined;;

  dEPass: Boolean = false;
  dEPseu: Boolean = false;
  dCEndMenu: Boolean = false;

  bEPass: boolean = true;
  bEPseu: boolean = true;
  bEndMEnu: boolean = true;

  listTheme: boolean = true;
  isDeleteTheme: boolean = false;

  cMenu: boolean = true;

  roleUser = localStorage.getItem('role');



  @ViewChild('oldpassword') iOPass!: ElementRef;
  @ViewChild('newpassword') iNPass!: ElementRef;


  constructor(private title: Title,
    private http: HttpClient,
    private settingsService: SettingsService,
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
  ) { }

  ngOnInit() {
    this.title.setTitle("EndOfTheAge - Settings");

    this.ps = localStorage.getItem('pseudo')!;

    this.getMenu();

    this.loadScript('../assets/js/plugins.js');
    this.loadScript('../assets/js/main.js');
    this.loadScript('../assets/js/password.js');
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


  getMenu() {
    this.http
      .get<any[]>(`${this.baseUrl}/menu`)
      .subscribe(
        (response) => {


          this.lMenu = response;
          //this.theme = response[0].name;

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );

  }


  async cPassword(oPassword: any, nPassword: any) {

    this.submitPassword = true;
    $('#bricks').hide();
    $('#loading').css('visibility', 'visible');

    const user = firebase.auth().currentUser;

    this.currentUser = user;

    const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      oPassword
    );

    this.iOPass.nativeElement.value = '';
    this.iNPass.nativeElement.value = '';


    try {
      await this.currentUser.reauthenticateWithCredential(credential);
      $('#loading').css('visibility', 'hidden');
      $('#bricks').show();
      $('#flash_message_success_uPassword').show();

      setTimeout(() => {
        $('#flash_message_success_uPassword').hide();

      }, 3000);
      this.submitPassword = false;

      return this.currentUser.updatePassword(nPassword);


    } catch (error) {
      $('#loading').css('visibility', 'hidden');
      $('#bricks').show();
      $('#flash_message__upseudo_notGranted').show();

      setTimeout(() => {
        $('#flash_message__upseudo_notGranted').hide();

      }, 3000);
      this.submitPassword = false;

      console.error(error);
    }

    //this.settingsService.updatePassword(oPassword, nPassword);
  }

  async cPseudo(pseudo: any) {

    $('#bricks').hide();
    $('#loading').css('visibility', 'visible');

    this.settingsService.updatePseudo(pseudo);


  }

  oDEPass() {
    
      this.dEPass = !this.dEPass;
      this.bEPseu = !this.bEPseu;
      this.bEndMEnu = !this.bEndMEnu


  }

  oDEPseu() {
    
      this.bEPass = !this.bEPass;
      this.bEndMEnu = !this.bEndMEnu;
      this.dEPseu = !this.dEPseu;


  }

  oDEndMenu() {
    // $('#bricks').hide();
    // $('#loading').css('visibility', 'visible');

    // setTimeout(() => {
    //   $('#loading').css('visibility', 'hidden');
    //   $('#bricks').show();
    //   this.bEPass = !this.bEPass;
    //   this.bEPseu = !this.bEPseu;
    //   this.dCEndMenu = !this.dCEndMenu;


    // }, 1500);

    this.bEPass = !this.bEPass;
    this.bEPseu = !this.bEPseu;
    this.dCEndMenu = !this.dCEndMenu;


  }

  async cEndMenu(menu: any, description:any, img_url:any) {

    $('#bricks').hide();
    $('#loading').css('visibility', 'visible');

    this.cMenu = !this.cMenu
    //this.settingsService.createMenu(menu);

    const mn = {
      name: menu,
      description : description,
      img_url: img_url,
      theme: []
    };



    this.http
      .post(this.baseUrl + `/create-menu/`, mn)
      .subscribe(
        (res) => {

          $('#loading').css('visibility', 'hidden');
          $('#bricks').show();
          $('#flash_message_success_cMenu').show();

          setTimeout(() => {
            $('#flash_message_success_cMenu').hide();

          }, 3000);

          this.lMenu = res;


        },
        (error) => {
          $('#loading').css('visibility', 'hidden');
          $('#bricks').show();

          $('#flash_message_success_icMenu').show();

          setTimeout(() => {
            $('#flash_message_success_icMenu').hide();

          }, 3000);


          console.log('Erreur ! : ' + error);
        }
      );


  }

  addMenu() {
    this.cMenu = !this.cMenu;
  }

  delMenu(menu: string) {

    $(`#deleteMenuModal-${menu}`).modal('hide');

    this.http
      .delete<any[]>(`${this.baseUrl}/delete-menu/${menu}`)
      .subscribe(
        (response) => {

          this.lMenu = response;
          $('#flash_message_success_dMenu').show();

          setTimeout(() => {
            $('#flash_message_success_dMenu').hide();

          }, 3000);
          //this.theme = response[0].name;

        },
        (error) => {
          console.log('Erreur ! : ' + error);
          $('#flash_message_success_idMenu').show();

          setTimeout(() => {
            $('#flash_message_success_idMenu').hide();

          }, 3000);
        }
      );



  }


  editMenu(id: string, menuEdit: string, description:string, img_url:string) {

    $("#deleteMenuModal-"+id).modal("hide");
    $("#themeMenuModal-"+id).modal("hide");


    const mn = {
      name: menuEdit,
      description : description,
      img_url: img_url,

    };

    this.http
      .put<any[]>(`${this.baseUrl}/edit-menu/${id}`, mn)
      .subscribe(
        (response) => {

          this.lMenu = response;
          $('#flash_message_success_eMenu').show();

          setTimeout(() => {
            $('#flash_message_success_eMenu').hide();

          }, 3000);
          //this.theme = response[0].name;

        },
        (error) => {
          console.log('Erreur ! : ' + error);
          $('#flash_message_success_ieMenu').show();

          setTimeout(() => {
            $('#flash_message_success_ieMenu').hide();

          }, 3000);
        }
      );

  }

  deleteTheme(themeId: string) {

    $(".listTheme-" + themeId).hide();
    $(".deleteTheme-" + themeId).show();
  }

  cDeletePost(menu: any, themeId: string) {

    $(".deleteMenuModal").modal("hide");
    $(".themeMenuModal").modal("hide");

    for (var i = 0; i < menu.theme.length; i++) {

      if (menu.theme[i].id === themeId) {

        menu.theme.splice(i, 1);
      }

    }

    const mn = {
      theme: menu.theme
    };
    
    this.http
      .put<any[]>(`${this.baseUrl}/delete-theme/${menu._id}`, [mn,themeId])
      .subscribe(
        (response) => {

          this.lMenu = response;
          
          $('#flash_message_success_eMenu').show();

          setTimeout(() => {
            $('#flash_message_success_eMenu').hide();

          }, 3000);
          //this.theme = response[0].name;

        },
        (error) => {
          console.log('Erreur ! : ' + error);
          $('#flash_message_success_ieMenu').show();

          setTimeout(() => {
            $('#flash_message_success_ieMenu').hide();

          }, 3000);
        }
      );


  }

  aDeletePost(themeId: string) {
    $(".deleteTheme-" + themeId).hide();
    $(".listTheme-" + themeId).show();

  }


  editTheme(themeId: string) {

    $(".listTheme-" + themeId).hide();
    $(".editTheme-" + themeId).show();
  }

  cEditPost(menu: any,themeId: string, vTheme: string) {

    for (var i = 0; i < menu.theme.length; i++) {

      if (menu.theme[i].id === themeId) {

        menu.theme[i].name = vTheme;
      }

    }

    const mn = {
      theme: menu.theme
    };

    $("#themeMenuModal-"+menu._id).modal("hide")

    this.http
      .put<any[]>(`${this.baseUrl}/edit-theme/${menu._id}`, mn)
      .subscribe(
        (response) => {

          this.lMenu = response;
          $('#flash_message_success_eMenu').show();

          setTimeout(() => {
            $('#flash_message_success_eMenu').hide();

          }, 3000);
          //this.theme = response[0].name;

        },
        (error) => {
          console.log('Erreur ! : ' + error);
          $('#flash_message_success_ieMenu').show();

          setTimeout(() => {
            $('#flash_message_success_ieMenu').hide();

          }, 3000);
        }
      );

    console.log(menu.theme);

  }


  aEditPost(themeId: string) {
    $(".editTheme-" + themeId).hide();
    $(".listTheme-" + themeId).show();

  }
    


}
