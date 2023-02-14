import { BehaviorSubject } from 'rxjs';

export class MyNotification {
  id: number;
  title: string;
  text: string;
  params: string[];
  options: { timeout?: number };
  level: 'success' | 'warning' | 'error' = 'success';
  paused: BehaviorSubject<boolean>;
  obs;
  constructor(params: any = {}) {
    this.id = new Date().getTime();
    this.paused = new BehaviorSubject<boolean>(false);
    this.title = params.title;
    this.text = params.text;
    this.params = params.params;
    this.options = params.options ? params.options : {};
    this.level = params.level;
  }
}