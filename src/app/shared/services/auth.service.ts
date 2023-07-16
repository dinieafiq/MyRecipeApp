import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Router } from '@angular/router';
const TOKEN_KEY = 'my-token';
import { Storage } from '@capacitor/storage';
import { environment } from 'src/environments/environment';
// const USER_ROLE = 'role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.baseUrl;
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  token: any;
  headerSet = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  constructor(private router: Router, private http: HttpClient) {
    this.loadToken()
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      // console.log('Current Token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  async logout(): Promise<void> {
    this.isAuthenticated.next(false);
    const token = await Storage.remove({ key: TOKEN_KEY });
    console.log('Token :', token);
    // this.router.navigate(['/login']);
  }

  login(credentials: { username; password }): Observable<any> {
    const header = new HttpHeaders(this.headerSet);
    return this.http
      .post(`${this.apiUrl}/login`, credentials, { headers: header })
      .pipe(
        map((data: any) => data),
        switchMap((data) => {
          console.log(data)
          this.token = data.token;
          return from(Storage.set({ key: TOKEN_KEY, value: data.token }));
        }),
        tap((_) => {
          this.isAuthenticated.next(true);
        })
      );

  }
}
