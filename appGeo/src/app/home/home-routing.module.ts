import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'
import { ChatComponent } from '../chat/chat.component'
import { KillingComponent } from '../player/killing.component'
//The Chat is added here so that the template can be represented
import { CampusMap } from '../map/campus-map.component'
import {Bubble} from '../map/map.component'
import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here

import { HomeComponent } from './home.component'


import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptFormsModule } from "@nativescript/angular";
import { NativeScriptModule } from "@nativescript/angular";





const routes: Routes = [
  {path: "Killing", component: KillingComponent},
  {path: "Chat", component: ChatComponent},
  { path: '',
    component: HomeComponent
  },
  { path: 'campusMap', component: CampusMap, pathMatch: 'full'},

]


@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes), FormsModule, NativeScriptFormsModule, CommonModule,
    ReactiveFormsModule,],
  exports: [NativeScriptRouterModule],
})
export class HomeRoutingModule {}