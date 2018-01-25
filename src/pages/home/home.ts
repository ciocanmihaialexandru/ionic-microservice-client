import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {JwtHelperService} from "@auth0/angular-jwt";
import {GlobalVariable} from "../../app/global";
import {Headers} from "@angular/http";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  isTokenValid: boolean = false;
  authType: string = "login";
  success: string;
  error: string;

  LOGIN_URL: string = GlobalVariable.BASE_URL + "/api/authenticate";
  SIGNUP_URL: string = GlobalVariable.BASE_URL + "/api/register";

  constructor(public navCtrl: NavController, public jwtHelperService: JwtHelperService, public http: HttpClient) {

    let access_token = localStorage.getItem("access_token");
    if (access_token && !jwtHelperService.isTokenExpired(access_token)) {
       this.isTokenValid = true;
    } else {
      this.isTokenValid = false;
    }

  }

  login(credentials) {
    this.success = ""
    this.error = ""

    if(credentials.username == "" || credentials.password == "") {
      this.error = "User name and password should be provided!"
    } else {
      this.http.post(this.LOGIN_URL, JSON.stringify(credentials))
        .subscribe(
          data => {
            this.error = "";
            this.authSuccess(data.access_token);
            this.navCtrl.setRoot(HomePage);
          },
          err => {
            console.log(err)
            this.success = ""
            if(err.status == 401) {
              this.error = "Invalid password and/or username.";
            }
            if(err.status == 400) {
              this.error = "Invalid call to the server.";
            }
          }
        );
    }

  }

  authSuccess(token) {
    this.error = null;
    localStorage.setItem('access_token', token);
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  onChangeTabs() {
    this.success = ""
    this.error = ""
  }


}
