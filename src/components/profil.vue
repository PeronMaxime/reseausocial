<template>
  <div>
    <h1 class="display-2">Profil</h1>

    <div id="profil">
      <img src="https://picsum.photos/100" alt="">
      <div>
        <p>{{importDataUser()}}{{pseudo}}</p>
        <p>Age</p>
      </div>
      <button>P</button>
    </div>

    <div id="listeAmis">
      <div class="amis"> <!-- onclick sur la class "amis" pour redirection vers le profil de l'ami -->
        <img src="https://picsum.photos/100/100" alt="">
        <p>Nom Prénom</p>
      </div>

      <div class="amis">
        <img src="https://picsum.photos/100/100" alt="">
        <p>Nom Prénom</p>
      </div>
    </div>
  </div>
</template>

<script>
const socket = io('http://localhost:1234');





export default {
  name: 'profil',
  data() {
    return {
      pseudo: 'toto'
    }
    
  },
  methods: {
    importDataUser(){
      let uuid = window.location.pathname.substring(8);
      
      socket.emit('sendUuid', {
        uuid
      })
      
      socket.on('sendProfilUser', function(data){
        
        // this.pseudo = data.user[0].pseudo;
      })

      this.test();

    },
    test(){
      console.dir(this);
    }
  }
}
</script>

<style>
  #profil{
    display: flex;
    width: 80%;
    margin-left: 10%;
    justify-content: space-between;
    border-top: 3px solid LightSlateGray;
    border-bottom: 3px solid LightSlateGray;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  #profil img{
    padding: 3px;
    border: 1px solid LightSlateGray;
    border-radius: 5px;
  }

  #profil button{
    height: 20px;
    width: 20px;
    font-size: 10px;
    padding: 0;
  }

  #listeAmis{
    display: flex;
    justify-content: space-evenly;
    margin-top: 10px;
  }

  .amis{
    display: flex;
    flex-direction: column;
    padding: 3px;
    border: 1px solid LightSlateGray;
    border-radius: 5px;
  }

  .amis p{
    margin: 0;
  }

  .amis:hover {
    opacity: 0.7;
  }
</style>