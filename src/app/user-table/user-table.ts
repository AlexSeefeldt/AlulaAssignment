import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ErrorToast } from '../error-toast/error-toast';
import { UserService } from '../user.service';

/// Displays a table of users pulled from the UserService.
@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [DatePipe, RouterLink, RouterOutlet, ErrorToast],
  templateUrl: './user-table.html',
  styleUrl: './user-table.css'
})
export class UserTableComponent {
  private api = inject(UserService);
  /// expose users to the template
  get users() { return this.api.users };
  /// helper function for showing new users
  isWithinMonth(date: Date): boolean {
    const now = new Date();
    const firstOfMonth = new Date(`${now.getMonth()} 1 ${now.getFullYear()}`);
    return date.getTime() >= firstOfMonth.getTime();
  }
}
