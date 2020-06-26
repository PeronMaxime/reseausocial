class SessionStore {

  constructor(){
    this.state = {
      pseudo: '',
      connected: false,
      isAdmin: false,
      uuid: ''
    }
  }

  setPseudo(pseudo){
    this.state.pseudo = pseudo;
  }

  setConnected(connected){
    this.state.connected = connected;
  }

  setIsAdmin(isAdmin){
    this.state.isAdmin = isAdmin;
  }

  setUuid(uuid){
    this.state.uuid = uuid;
  }

}

export default new SessionStore();