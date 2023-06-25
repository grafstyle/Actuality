import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from '@auth0/auth0-angular';

import { HomeComponent } from './home/home.component';
import { HomeForYouComponent } from './home/home-for-you/home-for-you.component';
import { HomeFollowedComponent } from './home/home-followed/home-followed.component';
import { ProfileComponent } from './profile/profile.component';
import { PostInputComponent } from './post-input/post-input.component';
import { SearchComponent } from './search/search.component';
import { SearchUsersComponent } from './search/search-users/search-users.component';
import { SearchAllComponent } from './search/search-all/search-all.component';
import { SearchPostsComponent } from './search/search-posts/search-posts.component';
import { LikesComponent } from './posts-components/likes/likes.component';
import { AddImagesInputComponent } from './post-input/add-images-input/add-images-input.component';
import { CommentsComponent } from './posts-components/comments/comments.component';
import { AddCommentComponent } from './posts-components/comments/add-comment/add-comment.component';
import { LoadScreenComponent } from './load-screen/load-screen.component';
import { ProfilePostsComponent } from './profile/profile-posts/profile-posts.component';
import { MultimediaPostsComponent } from './profile/multimedia-posts/multimedia-posts.component';
import { LikedPostsComponent } from './profile/liked-posts/liked-posts.component';
import { AlertComponentComponent } from './components/alert-component/alert-component.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomeForYouComponent,
    HomeFollowedComponent,
    ProfileComponent,
    PostInputComponent,
    SearchComponent,
    SearchAllComponent,
    SearchPostsComponent,
    SearchUsersComponent,
    LikesComponent,
    AddImagesInputComponent,
    CommentsComponent,
    AddCommentComponent,
    LoadScreenComponent,
    ProfilePostsComponent,
    MultimediaPostsComponent,
    LikedPostsComponent,
    AlertComponentComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot({
      domain: 'actuality-social.us.auth0.com',
      clientId: 'vVks5NbSd8KdAD9P7ILxI84b4Mdup09a',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
