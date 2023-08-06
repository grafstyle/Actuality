import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@auth0/auth0-angular';
import { Users } from 'src/app/controller/users/users';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css'],
})
export class SearchUsersComponent implements OnInit {
  err: string = '';
  users: User[] = [];

  constructor(private router: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    try {
      this.router.queryParams.subscribe({
        next: async (param) => {
          if (param['by'] != undefined)
            this.users = await Users.getIfContains({
              name: param['by'],
              url_name: param['by'],
            });
        },
      });
    } catch (e) {
      this.err = 'Somthing went wrong when get the users.';
    }
  }
}
