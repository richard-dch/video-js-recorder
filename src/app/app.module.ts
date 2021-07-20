import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoRecordComponent } from './video-record/video-record.component';
import { NewRecordComponent } from './new-record/new-record.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoRecordComponent,
    NewRecordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
