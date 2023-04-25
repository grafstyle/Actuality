import { Component } from '@angular/core';
import { User, Users } from '../controller/users/users';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  err: string = '';
  user: User = {} as User;

  async ngOnInit() {
    try {
      const userEmail: any = await Users.getByAuth();
      this.user = await Users.getByEmail(userEmail?.email);
    } catch (e) {
      this.err = 'Something went wrong getting the user.';
    }
  }
}
