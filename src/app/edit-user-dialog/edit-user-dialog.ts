import { Component, computed, effect, ElementRef, inject, signal, Signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Field, form } from '@angular/forms/signals';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user.types';

interface UserFormData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

/// manages edit user dialog and form
@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [Field],
  templateUrl: './edit-user-dialog.html',
})
export class EditUserDialogComponent {
  private api = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private user: Signal<User|null>;
  private userFormModel = signal<UserFormData>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  userForm = form(this.userFormModel);
  private dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  constructor() {
    // user is taken from route data, where we resolved it in app.routes.ts
    const data = toSignal(this.route.data, { initialValue: {} as Data });
    this.user = computed(() => data()["user"] ?? null);
    effect(() => {
      const user = this.user();
      if (user) {
        // when user is defined, show dialog and reset form for user
        this.dialog().nativeElement.showModal();
        this.userFormModel.set({
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          password: user.password,
        });
      } else {
        // otherwise, close the dialog
        this.dialog().nativeElement.close();
      }
    });
  }
  /// triggered on form submit, sends user update to API and closes modal by navigating back to /users
  submit() {
    const user = this.user();
    if (!user) {
      return;
    }
    this.api.updateUser({
      ...user,
      firstName: this.userForm.firstName().value(),
      lastName: this.userForm.lastName().value(),
      username: this.userForm.username().value(),
      password: this.userForm.password().value(),
    });
    this.router.navigate([""]);
  }
  close() {
    this.router.navigate([""]);
  }
}
