import { Component, OnInit } from '@angular/core';

@Component({
  template: `<div *ngIf="trigger">I've been triggered</div>`
})
export class MyComp {
  private _trigger = false;

  get trigger() {
    return this._trigger;
  }

  set trigger(val) {
    this._trigger = val;
    this.doSomething();  // Call some method
  }

  doSomething() {
    // ...
  }
}



@Component({
  selector: 'app-my-component2',
  templateUrl: '.dash.html',
  styleUrls: ['./my-component2.component.css']
})
export class MyComponent2Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}