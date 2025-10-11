import { Component, OnInit } from '@angular/core';
import { NavItem } from './model/nav-item';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {
  constructor(private state: StateService) {}

  ngOnInit(): void {

  }


}
