//TODO REMOVE THIS
//window.localStorage.clear();

//On obtiens l'ID via l'URL
const storage = window.localStorage;
const urlParams = new URLSearchParams(window.location.search);

//Produit actuel (envoyé au panier)
let finalProduct;
let currProduct;

var id = urlParams.get('id');

//On prépare le bouton "addToCart" avec la fonction qu'il appelle
document.getElementById("addToCart").onclick = addToCart;

//Obtenir le produit à partir de l'ID obtenu dans l'URl
fetch("http://localhost:3000/api/products/" + id).then(function(result){
  if(result.ok){
    return result.json();
  }
}).then(function(value){
  console.log(value);
  currProduct = value;
  drawProduct(value);
}).catch(function(error){
  console.log(error);
});

//Afficher les données du produit dans les éléments correspondants de la page
function drawProduct(product){

  //Image
  var imgStr = "<img src='" + product.imageUrl + "' alt='" + product.altTxt + "'>";
  appendHTML("item__img", 1, imgStr);

  //Info
  document.title = product.name;
  appendHTML("title", 0, product.name);
  appendHTML("price", 0, product.price);
  appendHTML("description", 0, product.description);

  //Couleurs
  for(var i = 0; i < product.colors.length; i++){
      var color = product.colors[i];
      var str = "<option value='" + color + "'>" + color + "</option>";
      
      appendHTML("colors", 0, str)
  }
}

//Ecrire une string HTML dans un élément donné grâce à son type.
//> element: l'élément dans lequel ajouter la string
//> type: 0 (id), 1 (classe)
//> html: la string à écrire dans l'élément sélectionné
function appendHTML(element, type, html){
    var element;

    if(type == 0){
        element = document.getElementById(element);
    }
    else{
        element = document.getElementsByClassName(element)[0];
    }

    element.innerHTML += html;
}

//TODO
function addToCart(){

  finalProduct = {
    id: id,
    quantity: document.getElementById('quantity').value,
    color: document.getElementById('colors').value,
    productInfo: currProduct
  }

  let cartProducts = [];
  let jsonStr = storage.getItem('products');
  if(jsonStr){
    cartProducts = JSON.parse(jsonStr);
    cartProducts.push(finalProduct);
  }
  else{
    cartProducts = [];
    cartProducts.push(finalProduct);
  }

  jsonStr = JSON.stringify(cartProducts);
  storage.setItem('products', jsonStr);
  
  //TODO manage input errors (min/max, color option 0)
  
  window.location.href = "http://127.0.0.1:5500/html/cart.html";
}