import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { BlogComponent } from './pages/blog/blog.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { PostComponent } from './pages/blog/post/post.component';
import { HeaderComponent } from './static/header/header.component';
import { FooterComponent } from './static/footer/footer.component';
import { MenuComponent } from './static/menu/menu.component';
import { ContactComponent } from './pages/contact/contact.component';
import { MobilemenuComponent } from './static/mobilemenu/mobilemenu.component';
import { PreloaderComponent } from './static/preloader/preloader.component';
import { PublishComponent } from './static/publish/publish.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { AuthService } from "./services/authservice.service";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostService } from './services/post.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { AddpostComponent } from './pages/modal/addpost/addpost.component';
import { DatePipe } from '@angular/common';
import { SafePipe } from './pipe/safe.pipe';

import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import { PseudoComponent } from './static/pseudo/pseudo.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { TruncatePipe } from './pipes/truncate.pipe';
import { CatpostComponent } from './pages/blog/catpost/catpost.component';
import { EditpostComponent } from './pages/blog/editpost/editpost.component';
import { TitlecasePipe } from './pipes/titlecase.pipe';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SettingsService } from './services/settings.service';
import { ToolbarComponent } from './static/toolbar/toolbar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AboutComponent } from './pages/about/about.component';
import { BlockMenuComponent } from './static/block-menu/block-menu.component';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { AuthGuard } from './shared/guard/auth.guard';
import { SecureInnerPagesGuard } from './shared/guard/secure-inner-pages.guard';
import { FourOhFourComponent } from './four-oh-four/four-oh-four.component';



//const config: SocketIoConfig = { url: "http://localhost:3001/", options: {} };
const config: SocketIoConfig = { url: "https://server-endoftheage.herokuapp.com/", options: {} };


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BlogComponent,
    LoginComponent,
    PostComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    ContactComponent,
    MobilemenuComponent,
    PreloaderComponent,
    PublishComponent,
    AddpostComponent,
    SafePipe,
    PseudoComponent,
    TruncatePipe,
    CatpostComponent,
    EditpostComponent,
    TitlecasePipe,
    SignUpComponent,
    SettingsComponent,
    ToolbarComponent,
    AboutComponent,
    BlockMenuComponent,
    FourOhFourComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    MatDialogModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    SocketIoModule.forRoot(config),
    ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareIconsModule



  ],
  providers: [AuthService, 
    PostService,
    DatePipe,
    SettingsService,
    AuthService, 
    AuthGuard, 
    SecureInnerPagesGuard


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
