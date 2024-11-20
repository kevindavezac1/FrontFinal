import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/pages/inicio/inicio.component';
import { PopupLoginComponent } from './components/layout/PopuoLogin/popup-login/popup-login.component';

const routes: Routes = [
  { path: '', component: InicioComponent }, 
  { path: 'popup', component: PopupLoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
