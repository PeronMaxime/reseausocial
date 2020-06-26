<template>
  <div>
    <h1 class="display-2">Inscription</h1>
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

      <div class="input-group my-3">
        <div class="input-group-prepend">
          <span class="input-group-text">E-mail</span>
        </div>
        <input class="form-control" type="email" name="email">
      </div>

      <button class="btn btn-primary" type="submit" @click.prevent="submitRegister">S'inscrire</button>
    </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import qs from 'qs';

export default {
  name: 'register',
  methods: {
    submitRegister() {
      const form = document.getElementById('form');

      if(form[0].value != '' && form[1].value != '' && form[2].value != ''){
        axios({
          method: 'post',
          url: '/register',
          data: qs.stringify({
            pseudo: form[0].value,
            pwd: form[1].value,
            email: form[2].value
          })
        })

        location.href = '/successRegister';
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