import {Component, OnInit} from "angular2/core";
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import {HeaderComponent} from "../header/header.component";
import {HomeComponent} from "../home/home.component";


@RouteConfig([
  {
    path: '/home',
    name: 'Home',
    component: HomeComponent,
    useAsDefault: true
  }
])
@Component({
  selector: 'my-app',
  template: `
      <header></header>
      <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES, HeaderComponent],
  providers: [
    ROUTER_PROVIDERS,
  ]
})
export class AppComponent implements OnInit{
  API_URL: String = 'http://' + location.hostname + ':3000/api';

  constructor() {}

  ngOnInit() {

  }
}
