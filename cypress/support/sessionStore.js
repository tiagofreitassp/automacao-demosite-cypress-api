// cypress/support/sessionStore.js
class SessionStore {
  #apiToken = null;
  #userID = null;
  #username = null;
  #password = null;

  get apiToken() { return this.#apiToken; }
  set apiToken(value) { this.#apiToken = value; }

  get userID() { return this.#userID; }
  set userID(value) { this.#userID = value; }

  get username() { return this.#username; }
  set username(value) { this.#username = value; }

  get password() { return this.#password; }
  set password(value) { this.#password = value; }

  clear() {
    this.#apiToken = null;
    this.#userID = null;
    this.#username = null;
    this.#password = null;
  }
}

// Uma única instância compartilhada entre os arquivos que importarem este módulo
const sessionStore = new SessionStore();
export default sessionStore;