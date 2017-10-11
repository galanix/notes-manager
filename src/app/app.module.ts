import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';

import { ApplicationComponent } from './application/application.component';
import { EnterFormComponent } from './enter-form/enter-form.component';
import { HeaderComponent } from './header/header.component';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { PopupFolderComponent } from './popup-folder/popup-folder.component';
import { PopupNoteComponent } from './popup-note/popup-note.component';
import { PopupTagComponent } from './popup-tag/popup-tag.component';
import { PopupNoteTagComponent } from './popup-note-tag/popup-note-tag.component';

import { EnterFormService } from './services/enter-form.service';
import { GeneralService } from '../app/services/general.service';
import { FolderService } from '../app/services/folder.service';
import { TagService } from '../app/services/tag.service';
import { NoteService } from '../app/services/note.service';

import { AppComponent } from './app.component';
import * as $ from 'jquery';



@NgModule({
  declarations: [
  AppComponent,
  EnterFormComponent, 
  HeaderComponent,
  WorkSpaceComponent, 
  PopupFolderComponent, 
  PopupNoteComponent, 
  PopupTagComponent, 
  PopupNoteTagComponent, 
  ApplicationComponent,
  ],
  imports: [
  BrowserModule,
  AngularFontAwesomeModule,
  RouterModule.forRoot([
    { path: '', redirectTo: '/application', pathMatch: 'full' },
    { path: 'application',  component: ApplicationComponent },
    { path: 'enter',  component: EnterFormComponent }
    ])
  ],
  providers: [
  GeneralService,
  FolderService,
  TagService,
  NoteService,
  EnterFormService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
