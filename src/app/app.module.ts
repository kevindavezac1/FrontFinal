import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './components/pages/inicio/inicio.component';
import { PopupLoginComponent } from './components/layout/PopuoLogin/popup-login/popup-login.component';


@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    PopupLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
