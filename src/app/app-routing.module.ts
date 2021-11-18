import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { BlogComponent } from './pages/blog/blog.component';
import { CatpostComponent } from './pages/blog/catpost/catpost.component';
import { EditpostComponent } from './pages/blog/editpost/editpost.component';
import { PostComponent } from './pages/blog/post/post.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'endTime-menu', component: BlogComponent },
  { path: 'endTime-menu/:cat/:theme', component: CatpostComponent },
  { path: 'post/edit/:id', component: EditpostComponent },
  { path: 'sign-in', component: LoginComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'post', component: PostComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
