import { Component, computed, effect, HostListener, inject, Inject, signal, Signal, WritableSignal } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-error-toast',
  standalone: true,
  imports: [],
  templateUrl: './error-toast.html',
})
export class ErrorToast {
  private api: UserService = inject(UserService);
  error: Signal<string|undefined> = computed(() => {
    const error = this.api.error();
    if (!error) return;
    return `Error occurred while ${error.type === 'fetchUsers' ? 'fetching users' : 'updating user'}`
  });
  show: WritableSignal<boolean> = signal(false);
  hideTimeout: number|undefined = undefined;
  constructor() {
    effect(() => {
      /// whenever api signal gives us a new error, show the toast
      if (this.api.error()) {
        this.show.set(true);
        /// if we were going to hide the toast, don't
        if (this.hideTimeout) {
          clearTimeout(this.hideTimeout);
          this.hideTimeout = undefined;
        }
      }
    });
  }
  /// dismiss the toast
  reset() {
    this.show.set(false);
  }
  /// if the user ignores the error and clicks somewhere else, dismiss it after four seconds
  @HostListener('window:click')
  windowClick() {
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => {
      this.show.set(false);
    }, 4000);
  }
}
