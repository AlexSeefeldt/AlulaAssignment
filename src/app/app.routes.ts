import { inject } from '@angular/core';
import { ResolveFn, Router, Routes } from '@angular/router';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog';
import { UserTableComponent } from './user-table/user-table';
import { UserService } from './user.service';
import { User } from './user.types';

/// determines a title for the edit user page based on current user
const userTitleResolver: ResolveFn<string> = (route) => {
  const user = route.parent!.data['user'];
  if (user) {
    return `Edit ${user.firstName} ${user.lastName}`;
  } else {
    inject(Router).navigate([""]);
    return 'Edit User'; // placeholder for type checking, but this shouldn't ever actually show up
  }
}

/// provides the user corresponding to the ID given in the route
const userResolver: ResolveFn<User|undefined> = async (route) => {
  return inject(UserService).getUserById(route.params['id']);
}

export const routes: Routes = [
  // show the user table under the /users path
  { path: 'users', title: "Users", component: UserTableComponent, children: [
    // resolve a user for the edit user dialog when we have an ID
    { path: 'edit/:id', resolve: { user: userResolver }, component: EditUserDialogComponent, children: [
      // this is a trick to resolve the title when on the edit user route
      // if it wasn't a child, the resolved user data wouldn't be available in the title resolver
      { path: '', title: userTitleResolver, component: EditUserDialogComponent }
    ] },
    // the edit user dialog is still present at the /users default path, it just doesn't have a user resolved
    { path: '', component: EditUserDialogComponent },
    // redirect everything back to /users
    { path: '**', redirectTo: '' }
  ] },
  // redirect all other paths to /users
  { path: '**', redirectTo: '/users' },
];
