import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicationComponent } from './application/application.component';
import { EnterFormComponent } from './enter-form/enter-form.component';
import { SettingsComponent } from './settings/settings.component';

import { MarkupComponent } from './settings/markup/markup.component';
import { ColorSchemeComponent } from './settings/color-scheme/color-scheme.component';
import { NoteComponent } from './settings/note/note.component';

// import { 
// 	ApplicationComponent, EnterFormComponent, SettingsComponent,
// 	WorkSpaceComponent
// } from './index';

const routes: Routes = [

{ path: '', redirectTo: '/application', pathMatch: 'full' },
{ path: 'application',  component: ApplicationComponent },
{ path: 'enter',  component: EnterFormComponent },
{ path: 'settings',  component: SettingsComponent },

{ path: 'settings/markup',  component: SettingsComponent },
{ path: 'settings/color',  component: SettingsComponent },
{ path: 'settings/note',  component: SettingsComponent }


];

@NgModule({
	imports: [ 
	RouterModule.forRoot(routes) 
	],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}