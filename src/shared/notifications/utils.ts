import { BehaviorSubject, Observable, defer, interval } from 'rxjs';
import { withLatestFrom, filter, take, map, share, reduce } from 'rxjs/operators';


const REFRESHING_SCALE = 10;

// tslint:disable-next-line:max-line-length
export function getPausableTimer(timeout: number, pause: BehaviorSubject<boolean>): { stepTimer: Observable<any>, completeTimer: Observable<any>, remainingPercent: Observable<any> } {
  const scaledInterval = 1000 / REFRESHING_SCALE;
  const scaledTimeout = timeout * REFRESHING_SCALE;
  const pausableTimer$ = defer(() => {
    let passedValues = 0;
    return interval(scaledInterval).pipe(
      withLatestFrom(pause),
      filter(([v, paused]) => !paused),
      take(scaledTimeout),
      map(v => passedValues++)
    )
  }).pipe(share());

  return { stepTimer: pausableTimer$, 
  completeTimer: pausableTimer$.pipe(reduce((x, y) => y)), 
  remainingPercent: pausableTimer$.pipe(map(v => ((scaledTimeout - (v + (REFRESHING_SCALE) )) / scaledTimeout) * 100 )) }
}