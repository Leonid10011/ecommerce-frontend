import Keycloak from "keycloak-js";
import KeycloakInstance from "keycloak-js";

const keycloakConfig = {
    url: 'http://localhost:8080/',
    realm: 'Ecommerce',
    clientId: 'myclient',
  };
  
const keycloak: KeycloakInstance = new Keycloak(keycloakConfig);

export default keycloak;
  