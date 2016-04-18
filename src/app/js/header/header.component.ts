import {Component, OnInit} from "angular2/core";
import { Router } from 'angular2/router';

@Component({
  selector: 'header',
  templateUrl:'./js/header/header.component.html',
  styleUrls: ['./js/header/header.component.css'],
})
export class HeaderComponent implements OnInit{


  constructor(
    private _router: Router
  ){}

  ngOnInit(){

  }

}
