import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { FollowedComponent } from './home/followed/followed.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'followed', component: FollowedComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'home', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  /*Nothing*/
}
