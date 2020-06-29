<template>
  <div>

    <h1 class="display-2">Connexion</h1>
    <form id="form">
    <div class="form-group">
      <div class="input-group my-3">
        <div class="input-group-prepend">
          <span class="input-group-text">Pseudo</span>
        </div>
        <input class="form-control" type="text" name="pseudo">
      </div>

      <div class="input-group my-3">
        <div class="input-group-prepend">
          <span class="input-group-text">Mot de passe</span>
        </div>
        <input class="form-control" type="password" name="pwd">
      </div>
      <button class="btn btn-primary" type="submit" @click.prevent="submitConnect">Se connecter</button>
    </div>
    </form>

    <div>
      <a href="/register" class="alert-link">Vous n'avez pas encore de compte ? Inscrivez-vous !</a>
    </div>

  </div>

  
</template>

<script>
import axios from 'axios';
import qs from 'qs';
const socket = io('https://reseausocialmaxime.herokuapp.com/');
import session from '../store/SessionStore';

export default {
  name: 'connect',
  
  methods: {
    
    submitConnect(){
      const form = document.getElementById('form');

      if(form[0].value != '' && form[1].value != ''){
        session.setPseudo(form[0].value);
        session.setConnected(true);
        axios({
          method: 'post',
          url: '/connect',
          data: qs.stringify({
            pseudo: form[0].value,
            pwd: form[1].value
          })
        })

        socket.emit('sendPseudo', {
          pseudo: session.state.pseudo
        })

        socket.on('sendInfoUtil', function(data){
          session.setIsAdmin(data.isAdmin);
          session.setUuid(data.uuid);
        })
        this.$router.push('/');
      }
      else{
        alert('Merci de remplir tous les champs');
      }
    }
  }

}
</script>

<style>
  form{
    width: 60%;
    margin-left: 20%;
  }

</style>