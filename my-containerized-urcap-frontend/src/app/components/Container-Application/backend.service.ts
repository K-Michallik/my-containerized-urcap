import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private randomNumberSubject: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  
  public readonly randomNumber$: Observable<number | null> = this.randomNumberSubject.asObservable();
  

  constructor(private http: HttpClient) {}


  fetchRandomNumber(url: string): void {
    const fullUrl = 'http://' + url + '/random-number';
    this.http.get<{ random_number: number }>(fullUrl).subscribe(response => {
      this.randomNumberSubject.next(response.random_number);
    });
  }


}