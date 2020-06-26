<template>
  <div>
    <p>Bienvenue sur mon réseau social</p>
    <button @click="listeConnectes" id="buttonListeConnecte">Afficher la liste des connectés</button>
    <ul id="listeConnectesUl">

    </ul>
  </div>
</template>

<script>
const socket = io('http://localhost:1234');



export default {
  
  name: "index",
  methods: {
    listeConnectes() {
      let listeConnectesUl = document.getElementById('listeConnectesUl');
      let buttonListeConnecte = document.getElementById('buttonListeConnecte');

      listeConnectesUl.innerHTML = '';
      buttonListeConnecte.style.display = 'none';

      socket.emit('demandeListeConnecte', {});

      socket.on('sendListeConnecte', function(data){
        
        
        for(let i=0; i<data.listeConnecte.length; i++){
          let li = document.createElement('li');
          li.innerHTML = '<a href="/profil/'+data.listeConnecte[i].uuid+'">'+ data.listeConnecte[i].pseudo +'</a>';
          listeConnectesUl.appendChild(li);
        }
      })
    }
  }

  

}
</script>

<style>
  ul{
    list-style: none;
  }

  li{
    font-weight: bold;
  }
  a:hover{
    color: grey;
    text-decoration: none;
  }

  a{
    color: black;
  }
</style>