import {Component, OnInit} from "angular2/core";
import { Router } from 'angular2/router';

@Component({
  selector: 'home-view',
  template: `
    <p> This is some super fancy text...  </p>
  `
})
export class HomeComponent{
  constructor(
    private _router: Router){
  }


}
