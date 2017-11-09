import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicationComponent } from './application/application.component';
import { EnterFormComponent } from './enter-form/enter-form.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
{ path: '', redirectTo: '/application', pathMatch: 'full' },
{ path: 'application',  component: ApplicationComponent },
{ path: 'enter',  component: EnterFormComponent },
{ path: 'settings',  component: SettingsComponent },
];

@NgModule({
	imports: [ 
	RouterModule.forRoot(routes) 
	],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}