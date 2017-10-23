import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';
import { CKEditorModule } from 'ng2-ckeditor';

import { 
  AppComponent, ApplicationComponent, EnterFormComponent, 
  HeaderComponent, WorkSpaceComponent, PopupFolderComponent, 
  PopupNoteComponent, PopupTagComponent, PopupNoteTagComponent,

  EnterFormService, GeneralService, FolderService, 
  TagService, NoteService
} from './index';

import * as $ from 'jquery';
// import { EditorComponent } from './editor/editor.component';


@NgModule({
  declarations: [
  AppComponent, EnterFormComponent, HeaderComponent,
  WorkSpaceComponent, PopupFolderComponent, PopupNoteComponent, 
  PopupTagComponent, PopupNoteTagComponent, ApplicationComponent, 
  // EditorComponent
  ],
  imports: [
  BrowserModule, AngularFontAwesomeModule, CKEditorModule,
  FormsModule,
  RouterModule.forRoot([
    { path: '', redirectTo: '/application', pathMatch: 'full' },
    { path: 'application',  component: ApplicationComponent },
    { path: 'enter',  component: EnterFormComponent }
    ])
  ],
  providers: [
  GeneralService, FolderService, TagService, 
  NoteService, EnterFormService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
