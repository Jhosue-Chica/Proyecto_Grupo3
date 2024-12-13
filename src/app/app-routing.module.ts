import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MateoPantallaPrincipalComponent } from './mateo-pantalla-principal/mateo-pantalla-principal.component';
import { MateoCrearPartidaComponent } from './mateo-crear-partida/mateo-crear-partida.component';
import { JhosueComponent } from './jhosue/jhosue.component';
import { BrithneyComponent } from './brithney/brithney.component';
import { CesarComponent } from './cesar/cesar.component';
import { JhosueGanadoresComponent } from './jhosue-ganadores/jhosue-ganadores.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: MateoPantallaPrincipalComponent },
  { path: 'crear-partida', component: MateoCrearPartidaComponent },
  { path: 'lobby', component: JhosueComponent },
  { path: 'tabla', component: BrithneyComponent },
  { path: 'unirse-partida', component: CesarComponent },
  { path: 'ganadores', component: JhosueGanadoresComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
