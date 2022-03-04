//Constantes
const storage = window.localStorage;

/*
    Les noms des inputs et les erreurs sont définis en haut du fichier.
    Ils peuvent être facilement modifiés et rendent le code plus lisible.
*/

//> Inputs
const INPUT_FIRSTNAME = "firstName";
const INPUT_LASTNAME = "lastName";
const INPUT_ADDRESS = "address";
const INPUT_CITY = "city";
const INPUT_EMAIL = "email";

//> Erreurs
const ERR_FIRSTNAME_EMPTY = "Veuillez entrer votre prénom.";
const ERR_LASTNAME_EMPTY = "Veuillez entrer votre nom.";
const ERR_ADDRESS_EMPTY = "Veuillez entrer votre adresse.";
const ERR_CITY_EMPTY = "Veuillez entrer votre ville.";
const ERR_EMAIL_EMPTY = "Veuillez entrer votre email.";
const ERR_EMAIL_REGEX = "L'email n'est pas valide. Le format doit ressembler à 'name@server.dom'";

//Variables
let cartProducts = [];
let totalQuantity = 0;
let totalPrice = 0;
let hasErrors = false;

//-------------------------------

//Init
document.getElementById('order').addEventListener('click', validateOrder);

//Update initial, premier dessin des produits du panier
updateCart();

//-------------------------------

//Mise à jour de la liste des produits, affichage dans le DOM
function updateCart(){

    //Effacer les données précédente (update après suppression)
    clearCart();

    //On récupère les produits du stockage local
    cartProducts = getCartProducts();

    if(cartProducts.length > 0)
    {
        //Afficher les produits du panier sur la page
        for(var i = 0; i < cartProducts.length; i++){

            var cartProduct = cartProducts[i];
            var id = cartProduct.id;
            var quantity = cartProduct.quantity;
            var color = cartProduct.color;
            var productInfo = cartProduct.productInfo;

            var htmlStr = 
            `<article class='cart__item' data-id='${id}' data-color='${color}'>` +
                "<div class='cart__item__img'>" +
                    `<img src='${productInfo.imageUrl}' alt='${productInfo.altTxt}'>` +
                "</div>" +
                "<div class='cart__item__content'>" +
                    "<div class='cart__item__content__description'>" +
                        `<h2>${productInfo.name}</h2>` +
                        `<p>${color}</p>` +
                        `<p>${productInfo.price}€</p>` +
                    "</div>" +
                    "<div class='cart__item__content__settings'>" +
                        "<div class='cart__item__content__settings__quantity'>"+
                            "<p>Qté :</p>"+
                            `<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value='${quantity}'>` +
                        "</div>" +
                        '<div class="cart__item__content__settings__delete">' +
                            '<p class="deleteItem">Supprimer</p>' +
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</article>";

            //Le prix final est additionné, incrémentation de la quantité
            totalQuantity++;
            totalPrice += (parseInt(quantity) * parseFloat(productInfo.price));

            document.getElementById('cart__items').innerHTML += htmlStr;
        }

        //Fonctionnalité des boutons "supprimer", ajout de leur fonction "onclick"
        var buttons = document.getElementsByClassName('deleteItem');

        for(let i = 0; i < buttons.length; i++){

            let deleteBtn = buttons[i];
            deleteBtn.onclick = function(){
                deleteItem(i);
            };
        }

        //Fonctionnalité des sélecteurs de quantité
        var numbs = document.getElementsByClassName('itemQuantity');

        for(let i = 0; i < numbs.length; i++){
            let numb = numbs[i];
            numb.onchange = function(){
                updateQuantity(i, numb);
            };
        }

        //Mise à jour du prix total
        updatePrice();
    }
}

//Mise à jour du total final
function updatePrice(){
    document.getElementById('totalQuantity').innerHTML = totalQuantity.toString();
    document.getElementById('totalPrice').innerHTML = totalPrice.toString();
}

//Effacter la liste des produits du panier (DOM)
function clearCart(){
    let container = document.getElementById('cart__items');
    if(container.childElementCount > 0){
        container.innerHTML = "";
    }

    //Le total est remis à 0
    totalQuantity = 0;
    totalPrice = 0;

    updatePrice();
}

//Obtenir le tableau des produits à partir du stockage
function getCartProducts(){
    let products = [];

    let jsonStr = storage.getItem('products');
    if(jsonStr){
        products = JSON.parse(jsonStr);
    }

    return products;
}

//Mise à jour de la quantité de l'objet sélectionné lors d'un changement de valeur
function updateQuantity(index, obj){
    cartProducts[index].quantity = obj.value;
    updateStorageItems();
}

//Mise à jour du tableau des produits du stockage
function updateStorageItems(){
    const jsonStr = JSON.stringify(cartProducts);
    storage.setItem('products', jsonStr);
    updateCart();
}

//Suppression d'un produit du panier puis mise à jour de la liste
function deleteItem(index){
    cartProducts.splice(index, 1);
    updateStorageItems();
}

//Vérification des inputs
function validateOrder(event){
    event.preventDefault();
    event.stopPropagation();

    if(!checkInputErrors()){
        sendFinalCart();
    }
    else{ //Erreurs, on ne continue pas le "submit"
        event.preventDefault();
        event.stopPropagation();
    }
}

//Vérifie les inputs en affichant les erreurs rencontrées
//Renvoie 'true' si il y a une erreur dans les inputs, 'false' si aucune erreur
function checkInputErrors(){
    clearErrors();

    /*
        La séparation des appels à "checkEmptyInput" ici pour chaque input
        permet, comme pour l'email, de continuer à vérifier d'autres erreurs si besoin
    */

    //--- Prénom ---
    checkEmptyInput(INPUT_FIRSTNAME, ERR_FIRSTNAME_EMPTY);

     //--- Nom ---
    checkEmptyInput(INPUT_LASTNAME, ERR_LASTNAME_EMPTY);

    //--- Adresse ---
    checkEmptyInput(INPUT_ADDRESS, ERR_ADDRESS_EMPTY);

    //--- Ville ---
    checkEmptyInput(INPUT_CITY, ERR_CITY_EMPTY);

    //--- Email ---
    let emailValue = getInputValue(INPUT_EMAIL);
    if(checkEmptyInput(INPUT_EMAIL, ERR_EMAIL_EMPTY)){         
         const regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]+$/); //Regex 'name@server.dom'
         if(!regex.test(emailValue)){
             drawError(INPUT_EMAIL, ERR_EMAIL_REGEX);
         }
    }

    return hasErrors;
}

//S'occupe de l'erreur en cas d'input vide et renvoie "true" si l'input n'a pas d'erreur, "false" en cas d'erreur
function checkEmptyInput(input, error){

    let element = document.getElementById(input);

    //On retire l'attribut "required" qui est répétitif, le JS prend le relai
    element.removeAttribute('required');

    if(element.value === ''){
        drawError(input, error);
        return false;
    }

    return true;
}

//Nettoie les erreurs affichées dans le DOM
function clearErrors(){
    let errors = document.querySelectorAll('.error');

    for(let i = 0; i < errors.length; i++){
        errors[i].remove();
    }

}

//Ecrit une erreur dans le DOM, à l'input donné
function drawError(input, error){
    hasErrors = true;

    let inElement = document.getElementById(input);
    let errElement = document.createElement('span');
    errElement.classList.add('error');

    errElement.style.backgroundColor = '#ff3636';
    errElement.style.borderRadius = '10px';
    errElement.style.padding = '5px';
    errElement.style.fontSize = '0.8em';
    errElement.style.color = '#fff';
    errElement.innerHTML = error;
    
    inElement.parentNode.insertBefore(errElement, inElement);
}

//Rends l'obtention de la valeur d'un input plus facile à lire
function getInputValue(input){
    return document.getElementById(input).value;
}

//Envoie le panier au serveur après la vérification
//Les données sont envoyées sous forme de Json
function sendFinalCart(){
    //Création de l'objet à envoyer
    let ids = [];

    for(let i = 0; i < cartProducts.length; i++){
        ids.push(cartProducts[i].id);
    }

    const orderObj = {
        contact: {
            firstName: getInputValue(INPUT_FIRSTNAME),
            lastName: getInputValue(INPUT_LASTNAME),
            address: getInputValue(INPUT_ADDRESS),
            city: getInputValue(INPUT_CITY),
            email: getInputValue(INPUT_EMAIL)
        },
        products: ids,
    };

    console.log(orderObj);

    const fetchOpt = {
        body: JSON.stringify(orderObj),
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    //Envoi des données
    fetch("http://localhost:3000/api/products/order/", fetchOpt)
    .then(function(res){
        if(res.ok){
            return res.json();
        }
    }).then(function(value){
        redirectWithValidation(value);
    }).catch((err) => {
        console.log("Impossible de valider les données: " + err.message)
    });
}

//Si le POST des informations est validé, on redirige avec l'id de commande obtenu
function redirectWithValidation(resJson){
    document.location.href = "confirmation.html?id=" + resJson.orderId;
}