import { Injectable } from "@angular/core";
import { getString, setString } from "application-settings";

import { User } from "./user.model";
import { BackendService } from "./backend.service";

const tokenKey = "token";

@Injectable()
export class LoginService {
  get isLoggedIn(): boolean {
    return !!getString(tokenKey);
  }

  private get token(): string {
    return getString(tokenKey);
  }
  private set token(theToken: string) {
    setString(tokenKey, theToken);
  }

  constructor(private backend: BackendService) {
  }

  register(user: User) {
    return Promise.resolve();
  }

  login(user: User) {
    return Promise.resolve();
  }

  logoff() {
    this.token = "";
  }

  resetPassword(email) {
    return Promise.resolve();
  }

  handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }
}
