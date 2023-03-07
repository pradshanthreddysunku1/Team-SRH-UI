import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class JadoreService {
  private refreshData = new BehaviorSubject<any>(null);
  public refreshData$ = this.refreshData.asObservable();


  private refreshInstructorData = new BehaviorSubject<any>(null);
  public refreshInstructorData$ = this.refreshInstructorData.asObservable();

  private modalSate = new BehaviorSubject<any>(null);
  public modalSate$ = this.modalSate.asObservable();


  private modalSateInstructor = new BehaviorSubject<any>(null);
  public modalSateInstructor$ = this.modalSateInstructor.asObservable();

  setRefresh(state:any) {
    this.refreshData.next(state);
  }
  setRefreshInstructorData(state:any) {
    this.refreshInstructorData.next(state);
  }


  toggleInstructorModal(data: any) {
    this.modalSateInstructor.next(data);
  }

  toggleModal(data:any) {
    this.modalSate.next(data);
  }

  constructor(private http: HttpClient) { }
      post(user:object, url:string):Observable<any> {
        return this.http.post(url, user, httpOptions);
      }
      get(url: string): Observable<any> {
        return this.http.get(url, httpOptions);
      }
      put(user: object, url: string): Observable<any>{
        return this.http.put(url,user, httpOptions);
      }

      delete(url: string): Observable<any> {
        return this.http.delete(url, httpOptions);
      }
}
