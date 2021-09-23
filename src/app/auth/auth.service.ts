import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginResponse, Votant, Admin } from '../shared/user.model';
import { User } from '../shared/user';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@capacitor/storage';
const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _token = new BehaviorSubject<string>(null);
  private _user = new BehaviorSubject<Votant | Admin | User>(null)
  private _userRole: string;
  private _userData = new BehaviorSubject<any>(null);
  activeLogoutTimer: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastCtrl: ToastController
  ) { }


  get token(): Observable<string> {
    return this._token.asObservable();
  }

  loginVotant(email: string, password: string) {
    const loginData = {
      email,
      password,
    };
    return this.http
      .post<{user: LoginResponse}>(`${API_URL}/votant/login`, loginData)
      .pipe(
        tap((response) => {
          if (response.user.token) {
            this.presentToast(response.user.message);
          this.setUserData(response.user, 'votant');
          console.log(response.user.message);
          this._token.next(response.user.token);
            return true;
          } else {
            this.presentToast(response.user.message)
            return false;
          }
        })
      );
  }

  
  loginAdmin(email: string, password: string) {
    const loginData = {
      email,
      password,
    };
    return this.http
      .post<{user: LoginResponse,}>(`${API_URL}/admin/login`, loginData)
      .pipe(
        tap((response) => {
          if (response.user.token) {
            this.presentToast(response.user.message);
          this.setUserData(response.user, 'admin');
          console.log(response.user.message);
          this._token.next(response.user.token);
            return true;
          } else {
            this.presentToast(response.user.message)
            return false;
          }
        })
      );
  }
  activationCompte(email: string, password: string, cin: string) {
    return this.http.post<{user: LoginResponse}>(`${API_URL}/votant/register`, {email, password, cin})
    .pipe(
      tap((response) => {
        if (response.user.token) {
          this.presentToast(response.user.message);
        this.setUserData(response.user, 'votant');
        console.log(response.user.message);
        this._token.next(response.user.token);
          return true;
        } else {
          this.presentToast(response.user.message)
          return false;
        }
      })
    )
  }

  autoLogin() {
    return from(Storage.get({ key: 'authData' })).pipe(
      map(storedData => {
        console.log(storedData)
        if (!storedData || !storedData) {
          return null;
        }
        console.log(storedData);
        const parsedData = JSON.parse(storedData['value']) as {
          name: string;
          userId: string;
          email: string;
          token: string;
          tokenExpirationData: string;
          userRole: string;
        };
        this._userData.next(parsedData);
        const expirationTime = new Date(parsedData.tokenExpirationData);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          parsedData.email,
          parsedData.userId,
          parsedData.userRole,
          parsedData.token,
          new Date(expirationTime)
        );
        return user;
      }),
      tap((user) => {
        if (user) {
          this._user.next(user);
          //this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  
  get userIsAuthenticated(): Observable<boolean> {
    return this._token.asObservable().pipe(
      map((token) => {
        if (token) {
        return !!token;
        } else {
          return false;
        }
      })
    );
  }
  // get userAuth() {
  //   return this._user.asObservable().pipe(map(user => {
  //     if (user) {
  //       return !!user.
  //     } else {
        
  //     }
  //   }))
  // }
get user() {
  return this._user.asObservable();
}
get userData() {
  return this._userData.asObservable();
}
  logout() {
    this._user.next(null);
    Storage.remove({ key: 'authData' });
    this.router.navigateByUrl('/auth');
  }
  private autoLogout(duration: number = 50000) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    },
    duration);
  }
  private setUserData(
    userData: LoginResponse,
    userType: 'votant' | 'admin'
  ) {
    console.log(userData);
    const expirationTime = new Date().getTime() + +userData.expiresIn +900000;
    const user = new User(
      userData.user.email,
      userData.user._id,
      userType,
      userData.token,
      new Date(expirationTime)
      );
      console.log(user)
    this._user.next(userData.user);
    //this.autoLogout(expirationTime);
    this.storeAuthData(
      userData.user.firstName + ' ' + userData.user.lastName,
      userData.user._id, 
      userData.token, 
      expirationTime.toString(), 
      userData.user.email, 
      userType)
  }
  private async storeAuthData(
    name: string,
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string,
    userRole: 'votant' | 'admin'
    ) {
      const data = JSON.stringify({userId, token, tokenExpirationDate, email, userRole, name});
    await Storage.set({ key: 'authData', value: data });
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      position:'top',
      duration: 3000
    });
    toast.present();
  }
  
  ngOnDestroy(): void {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

}
