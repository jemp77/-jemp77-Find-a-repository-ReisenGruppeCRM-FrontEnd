import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CelebrateService {
  celebrate = new Subject();
  celebrate$ = this.celebrate.asObservable();

  startCelebration(celebrationParams: any): void {
    this.celebrate.next(celebrationParams);
  }
}
