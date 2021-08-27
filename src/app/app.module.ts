import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy} from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { KellypoolComponent } from './kellypool/kellypool.component';

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { AngularFireModule } from '@angular/fire';
// import { config } from 'process';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBo2h_d7VBF0dMIKXonbFYwr0K9WcGSYT0",
  authDomain: "docheltree-portfolio.firebaseapp.com",
  projectId: "docheltree-portfolio",
  storageBucket: "docheltree-portfolio.appspot.com",
  messagingSenderId: "634927709124",
  appId: "1:634927709124:web:ec61feb83aa2d5041bc291",
  measurementId: "G-GDQG5CZEHP"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    KellypoolComponent
  ],
  imports: [
    // AngularFireModule.initializeApp(config),
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
