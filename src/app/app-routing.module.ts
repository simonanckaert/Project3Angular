import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SessieLijstComponent } from './sessie-lijst/sessie-lijst.component';
import { AuthGuardService } from './auth-guard.service';
import { LoginComponent } from './login/login.component';
import { RegistrerenComponent } from './registreren/registreren.component';
import { GebruikersComponent } from './gebruikers/gebruikers.component';
import { AankondigingenComponent } from './aankondiging/aankondigingen.component';
import { BerichtenComponent } from './berichten/berichten.component';
import { FeedbackComponent } from './feedback/feedback.component';

const appRoutes: Routes = [
  { path: '', canActivate: [AuthGuardService], component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registreren', canActivate: [AuthGuardService], component: RegistrerenComponent },
  { path: 'aankondigingen', component: AankondigingenComponent },
  { path: 'sessies', canActivate: [AuthGuardService], component: SessieLijstComponent },
  { path: 'gebruikers', canActivate: [AuthGuardService], component: GebruikersComponent },
  { path: 'berichten', canActivate: [AuthGuardService], component: BerichtenComponent },
  { path: 'feedback', canActivate: [AuthGuardService], component: FeedbackComponent },
  { path: '**', canActivate: [AuthGuardService], component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
