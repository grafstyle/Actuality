import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeFollowedComponent } from './home/home-followed/home-followed.component';
import { SearchComponent } from './search/search.component';
import { HomeForYouComponent } from './home/home-for-you/home-for-you.component';
import { SearchPostsComponent } from './search/search-posts/search-posts.component';
import { SearchUsersComponent } from './search/search-users/search-users.component';
import { SearchAllComponent } from './search/search-all/search-all.component';
import { ProfilePostsComponent } from './profile/profile-posts/profile-posts.component';
import { MultimediaPostsComponent } from './profile/multimedia-posts/multimedia-posts.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: HomeForYouComponent },
      { path: 'followed', component: HomeFollowedComponent },
    ],
  },
  { path: 'home', redirectTo: '' },
  { path: 'login', redirectTo: '' },
  { path: 'signup', redirectTo: '' },
  {
    path: 'search',
    component: SearchComponent,
    children: [
      { path: '', component: SearchAllComponent },
      { path: 'users', component: SearchUsersComponent },
      { path: 'posts', component: SearchPostsComponent },
    ],
  },
  {
    path: ':profile',
    component: ProfileComponent,
    children: [
      { path: '', component: ProfilePostsComponent },
      { path: 'multimedia', component: MultimediaPostsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  /*Nothing*/
}
