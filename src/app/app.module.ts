import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';
import { CKEditorModule } from 'ng2-ckeditor';

import { 
  AppComponent, ApplicationComponent, EnterFormComponent, 
  HeaderComponent, WorkSpaceComponent, PopupFolderComponent, 
  PopupNoteComponent, PopupTagComponent, PopupNoteTagComponent,
  SettingsComponent, AppRoutingModule, SettingsWorkSpaceComponent,

  EnterFormService, GeneralService, FolderService, 
  TagService, NoteService
} from './index';

declare var $: any;

@NgModule({
  declarations: [
  AppComponent, EnterFormComponent, HeaderComponent,
  WorkSpaceComponent, PopupFolderComponent, PopupNoteComponent, 
  PopupTagComponent, PopupNoteTagComponent, ApplicationComponent, 
  SettingsComponent, SettingsWorkSpaceComponent, 
  ],
  imports: [
  BrowserModule, AngularFontAwesomeModule, CKEditorModule,
  FormsModule, AppRoutingModule
  ],
  providers: [
  GeneralService, FolderService, TagService, 
  NoteService, EnterFormService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
