import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import { API_URL } from './app.config';
import { ApiUser, apiUserFromUser, User, userFromApiUser } from './user.types';

export type Error = {
  type: "fetchUsers"|"updateUser";
};

/// Provides access to the Users api
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private url = inject(API_URL);
  // this signal will be undefined until the first time fetchUsers() is subscribed and delivers a value
  #users: WritableSignal<User[]|undefined> = signal(undefined);
  // exposes the fetched users as a signal, with a default empty value
  users = computed(() => this.#users() ?? []);
  #error: WritableSignal<Error|undefined> = signal(undefined);
  error = this.#error.asReadonly();

  constructor() {
    // in a real app you probably wouldn't want to fetch something upon construction, but this app always needs the user list loaded
    this.fetchUsers().subscribe();
  }

  /// fetch the user list and update the users signal
  private fetchUsers(): Observable<User[]> {
    return this.http.get<ApiUser[]>(`${this.url}/User`).pipe(map(apiUsers => {
      const users = apiUsers.map(userFromApiUser);
      this.#users.set(users);
      return users;
    }), catchError((error) => {
      console.error(error);
      this.#error.set({ type: "fetchUsers" });
      return [];
    }));
  }

  async getUserById(id: string): Promise<User|undefined> {
    const users = this.#users() || await firstValueFrom(this.fetchUsers());
    return users.find(u => u.id === id);
  }

  /// update the given user with the API and then refetch user list
  updateUser(user: User) {
    // save the current user list in case of an error
    const rollbackUsers = this.#users();
    // optimistic update!
    this.#users.update(users => {
      if (!users) return;
      const copy = [...users];
      const index = users.findIndex(u => u.id === user.id);
      if (index === -1) return;
      copy[index] = user;
      return copy;
    });
    return this.http.put(`${this.url}/User/${user.id}`, apiUserFromUser(user))
      .subscribe({
        next: () => {
          this.fetchUsers().subscribe();
        },
        error: error => {
          console.error(error);
          this.#error.set({ type: "updateUser" });
          // roll back the user list
          this.#users.set(rollbackUsers);
        },
      });
  }
}
