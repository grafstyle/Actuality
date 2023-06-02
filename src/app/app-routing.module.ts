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

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: HomeForYouComponent },
      { path: 'followed', component: HomeFollowedComponent },
    ],
  },
  { path: ':profile', component: ProfileComponent },
  {
    path: 'search',
    component: SearchComponent,
    children: [
      { path: '', component: SearchAllComponent },
      { path: 'users', component: SearchUsersComponent },
      { path: 'posts', component: SearchPostsComponent },
    ],
  },
  { path: 'home', redirectTo: '' },
  { path: 'login', redirectTo: '' },
  { path: 'signup', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  /*Nothing*/
}
