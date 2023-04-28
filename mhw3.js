//Url utilizzato per raggirare il problema cors
const url= "https://cors-anywhere.herokuapp.com/";
const limit=3;
const endpoint_api_key='https://sportscore1.p.rapidapi.com';
const key_endpoint='64aab0c3femshda16c9d50c2933bp14815djsnc1a91d083322';
const endpoint_spotify='https://api.spotify.com/v1/search?type=album&q=';
const endpoint_token='https://accounts.spotify.com/api/token';

function JsonSpotify(json)
{
    
    //svuotiamo sempre la libreria
    const contenuto= document.querySelector('#risultati');
    contenuto.innerHTML='';
    const results = json.albums.items;
    let numero_risultati = results.length;
    if(numero_risultati> 10)
    numero_risultati = 10;
    for(let j=0; j<numero_risultati; j++)
  {
    const album_data = results[j]
    const titolo = album_data.name;
    const immagine = album_data.images[0].url;
    const album = document.createElement('div');
    album.classList.add('album');
    const img = document.createElement('img');
    img.src = immagine;
    const didascalia = document.createElement('span');
    didascalia.textContent = titolo;
    album.appendChild(img);
    album.appendChild(didascalia);
    contenuto.appendChild(album);
  }
}

function OnJsonkey(json)
{
    console.log('Json Sport Score ricevuto');
    console.log(json);
    //seleziono la libreria e cancello tutto
    const contenuto= document.querySelector('#risultati');
    contenuto.innerHTML='';
    const results=json.data;
    if(results.length==0)
    {
        alert('Calciatore non trovato!!');
    }
    const nome = document.createElement('h1');
    const nazionalità= document.createElement('h2');
    const img= document.createElement('img');
    nome.textContent=results[0].name;
    nazionalità.textContent=results[0].flag;
    img.src=results[0].photo;
    contenuto.classList.add('container');
    contenuto.appendChild(nome);
    contenuto.appendChild(nazionalità);
    contenuto.appendChild(img);
}
function OnResponse(response)
{
    console.log('Risposta ricevuta');
    return response.json();
}

//Questa sarà la funzione dove eseguirò le fetch
function Search(event)
{
    //Blocco il comportamento naturale del form che è quello di ricaricare la pagina
    event.preventDefault();
    //seleziono il testo
    const testo=document.querySelector('#contenuto');
    const valore=encodeURIComponent(testo.value);
    console.log('Eseguo la ricerca del valore:'+valore);
    //selezioniamo ora il tipo di API
    const tipo=document.querySelector('#tipo').value;
    console.log('tipo selezionato='+tipo);
    //ora impostiamo le condizioni per eseguire le varie fetch
    if(tipo==='api_key')
    {
       const url_key=endpoint_api_key +'/players/search?name='+valore;
       fetch(url_key,{
        method: 'POST',
        headers: {
            'X-RapidAPI-Key': '64aab0c3femshda16c9d50c2933bp14815djsnc1a91d083322',
            'X-RapidAPI-Host': 'sportscore1.p.rapidapi.com'
        }
    }).then(OnResponse).then(OnJsonkey)
    }
    else if(tipo==='oauth')
    {
        fetch(endpoint_spotify+valore,
        {
           // mode:'no-cors',
            headers:
            {
              'Authorization': 'Bearer ' + token
            }
          }
        ).then(OnResponse).then(JsonSpotify);

    }
}
function OnTokenJson(json)
{ 
    console.log('ho impostato il token globale può essere usato');
  token=json.access_token;
}
function onTokenResponse(response)
{
    console.log('token response ricevuto');
    return response.json();
}
//faccio la variabile per ottenere il token
let token;
const client_id='ec89950e9f234e73a9106107561e418b';
const client_secret='ced07f9010b54cacb074ad9b5ffa700c';

 fetch(endpoint_token,
    {
       method:'POST',
       //mode:'no-cors',
       //Credential:'include',
       body:'grant_type=client_credentials',
       headers:
       {
        //'Access-Control-Allow-Origin':'*',
        //'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)

       }
    }
    ).then(onTokenResponse).then(OnTokenJson);
        
//come primo passaggio facciamo selezioniamo il form
const form=document.querySelector('#ricerca_contenuto');
form.addEventListener('submit',Search);