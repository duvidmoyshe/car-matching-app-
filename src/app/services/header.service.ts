import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private headerTitleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('Default Header');
  public headerTitle$: Observable<string> = this.headerTitleSubject.asObservable();

  setHeaderTitle(title: string): void {
    this.headerTitleSubject.next(title);
  }
}
