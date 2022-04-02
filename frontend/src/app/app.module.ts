// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './modules/app-routing/app-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';

// Material
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';

// Components
import { AppComponent } from './app.component';
import { PanelComponent } from './components/panel/panel.component';
import { WorkItemListComponent } from './components/work-item-list/work-item-list.component';
import { CreateWorkItemComponent } from './components/create-work-item/create-work-item.component';
import { LoginComponent } from './components/login/login.component';
import { MyProjectsComponent } from './components/my-projects/my-projects.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { WorkItemComponent } from './components/work-item/work-item.component';
import { EstimateSingleComponent } from './components/estimate-single/estimate-single.component';

@NgModule({
  declarations: [
    AppComponent,
    PanelComponent,
    WorkItemListComponent,
    CreateWorkItemComponent,
    LoginComponent,
    MyProjectsComponent,
    NavbarComponent,
    HomeComponent,
    SignupComponent,
    WorkItemComponent,
    EstimateSingleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatExpansionModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatCardModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgApexchartsModule
  ],
  entryComponents: [PanelComponent, WorkItemListComponent],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
