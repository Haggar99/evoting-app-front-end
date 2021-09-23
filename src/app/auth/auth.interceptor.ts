import { AuthService } from './auth.service';
import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, switchMap, take } from 'rxjs/operators';
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    public toastController: ToastController,
    private authService: AuthService,
    private loadingCtrl: LoadingController
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        const authRequest = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + token),
        });
        this.loadingCtrl.getTop().then((hasLoading) => {
          if (!hasLoading) {
            this.loadingCtrl
              .create({
                spinner: 'circular',
                translucent: true,
              })
              .then((loading) => loading.present());
          }
        });
        return next.handle(authRequest).pipe(
          finalize(() => {
            this.loadingCtrl.getTop().then((hasLoading) => {
              this.authService.autoLogin();
              if (hasLoading) {
                this.loadingCtrl.dismiss();
              }
            });
          })
        );
      })
    );
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}
