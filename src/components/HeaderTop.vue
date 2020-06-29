<template>
  <div>
    <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
      <a href="/" class="navbar-brand">Home</a>

      <button class="navbar-toggler navbar-toggler-left" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" v-if="!connected">
            <router-link :to="{name: 'connect'}" class="nav-link">Connexion</router-link>
          </li>
          <li class="nav-item" v-if="connected">
            <router-link :to="{path: profilUrl}" class="nav-link">Profil</router-link>
          </li>
          <li class="nav-item" v-if="connected">
            <router-link :to="{name: 'messages'}" class="nav-link">Messages</router-link>
          </li>
          <li class="nav-item" v-if="connected">
            <div @click='disconnect' class="nav-link">Déconnexion</div>
          </li>
          <li class="nav-item" v-if="isAdmin">
            <router-link :to="{name: 'admin'}" class="nav-link">Administration</router-link>
          </li>
          <li class="nav-item">
            <div @click='actualise' class="nav-link">Actualiser</div>
          </li>

        </ul>
      </div>

      <img src="/static/img/search.png" alt="">
      <input type="text" name="recherche" id="recherche">
    </nav>
  </div>
</template>

<script>
import session from '../store/SessionStore';
const socket = io('https://reseausocialmaxime.herokuapp.com/');
export default {
  name: 'HeaderTop',

  data(){
    return {
      profilUrl: 'profil/'+session.state.uuid,
      connected: session.state.connected,
      isAdmin : session.state.isAdmin
    }
  },
  methods: {
    actualise : function(){
      this.connected = session.state.connected;
      this.isAdmin = session.state.isAdmin;
    },
    
    
    disconnect: function(){
      socket.emit('sendUuidDeco', {
        uuid: session.state.uuid
      });

    }
  }
}
</script>

<style>
  .visible{
    display: block;
  }
  .notVisible{
    display: none;
  }
</style>