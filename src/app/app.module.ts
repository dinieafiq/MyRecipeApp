import { FormsModule } from '@angular/forms';
import { PopoverComponent } from './popover/popover.component';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { AuthService } from './shared/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { DbService } from './shared/services/db.service';

@NgModule({
  declarations: [AppComponent, PopoverComponent],
  // entryComponents: [PopoverComponent], 
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule],
  providers: [AuthService, AuthGuard, DbService, SQLite, NavParams, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
