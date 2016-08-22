import { nativeScriptBootstrap } from "nativescript-angular/application";
import { APOLLO_PROVIDERS, defaultApolloClient } from "angular2-apollo";
import ApolloClient, { createNetworkInterface } from "apollo-client";

import { APP_ROUTER_PROVIDERS } from "./app.routes";
import { AppComponent } from "./app.component";
import { setStatusBarColors, BackendService, LoginService } from "./shared";

const client = new ApolloClient({
  networkInterface: createNetworkInterface('http://localhost:8080/graphql'),
})

setStatusBarColors();
nativeScriptBootstrap(AppComponent, [
  BackendService,
  LoginService,
  APOLLO_PROVIDERS,
  defaultApolloClient(client),
  APP_ROUTER_PROVIDERS
]);
