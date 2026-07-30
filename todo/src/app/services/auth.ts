import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  isLoggedIn = signal(false);

  constructor() {
    this.checkToken();
  }

  checkToken() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      this.isLoggedIn.set(!!token);
    }
  }

  login(token: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
    }
    this.isLoggedIn.set(true);
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.isLoggedIn.set(false);
  }
}
