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
    MatIconModule

  ],
  providers: [AuthService, PostService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
