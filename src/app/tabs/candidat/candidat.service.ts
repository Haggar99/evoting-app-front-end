import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Candidat, Votant } from 'src/app/shared/user.model';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CandidatService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  get candidats() {
    return this.http.get<{candidats: Candidat[]}>(`${API_URL}/candidat`);
  }
  votant(votantId: string) {
    return this.http.get<{votant: Votant}>(`${API_URL}/votant/${votantId}`);
  }
  voter(userId: string, candidatId: string){
    return this.http
    .post<{message: string}>(`${API_URL}/votant/voter`, {userId, candidatId})
    .pipe(tap(response => {
      this.authService.presentToast(response.message);
    }))
  }
}
