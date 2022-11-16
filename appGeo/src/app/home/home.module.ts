import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from '@nativescript/angular'

import { HomeRoutingModule } from './home-routing.module'
import { HomeComponent } from './home.component'
import {Chat} from '../chat/chat.component'
import {Bubble} from '../map/map.component'
import {CampusMap} from '../map/campus-map.component'
@NgModule({
  imports: [NativeScriptCommonModule, HomeRoutingModule],
  declarations: [HomeComponent, Bubble, CampusMap, Chat],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HomeModule {}

