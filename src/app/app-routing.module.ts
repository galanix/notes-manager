import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApplicationComponent } from './application/application.component';
import { EnterFormComponent } from './enter-form/enter-form.component';
import { SettingsComponent } from './settings/settings.component';
import { WorkSpaceComponent } from './application/work-space/work-space.component';
import { HeaderComponent } from './application/header/header.component';

// import { 
// 	ApplicationComponent, EnterFormComponent, SettingsComponent,
// 	WorkSpaceComponent
// } from './index';

const routes: Routes = [
{ path: '', redirectTo: '/application', pathMatch: 'full' },
{ path: 'application',  component: ApplicationComponent },
{ path: 'enter',  component: EnterFormComponent },
{ path: 'settings',  component: SettingsComponent },

// { path: 'application/note_id',  component: ApplicationComponent },
// { path: 'application/folder_id',  component: ApplicationComponent },
// { path: 'application/tag_id',  component: ApplicationComponent }
];

@NgModule({
	imports: [ 
	RouterModule.forRoot(routes) 
	],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}