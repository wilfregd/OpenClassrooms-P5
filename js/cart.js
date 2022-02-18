//Constantes
const storage = window.localStorage;

//> Erreurs
const ERR_FIRSTNAME_EMPTY = "Veuillez entrer votre prénom.";
const ERR_LASTNAME_EMPTY = "Veuillez entrer votre nom.";
const ERR_ADDRESS_EMPTY = "Veuillez entrer votre adresse.";

//Variables
let cartProducts = [];
let totalQuantity = 0;
let totalPrice = 0;
let errors = {
    'firstName': [],
    'lastName': [],
};

//-------------------------------

//Init
document.getElementById('order').onclick = function(){
    validateOrder();
};

//Update initial, premier dessin des produits du panier
updateCart();

//-------------------------------

//Mise à jour de la liste des produits, affichage dans le DOM
function updateCart(){

    //Effacer les données précédente (update après suppression)
    clearCart();

    //On récupère les produits du stockage local
    cartProducts = getCartProducts();

    console.log(cartProducts);



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
            "<article class='cart__item' data-id='" + id + "' data-color='" + color + "'>" +
                "<div class='cart__item__img'>" +
                    "<img src='" + productInfo.imageUrl + "' alt=\"" + productInfo.altTxt + "\">" +
                "</div>" +
                "<div class='cart__item__content'>" +
                    "<div class='cart__item__content__description'>" +
                        "<h2>" + productInfo.name + "</h2>" +
                        "<p>" + color + "</p>" +
                        "<p>" + productInfo.price + "€</p>" +
                    "</div>" +
                    "<div class='cart__item__content__settings'>" +
                        "<div class='cart__item__content__settings__quantity'>"+
                            "<p>Qté :</p>"+
                            '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="' + quantity + '">' +
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
    console.log(storage.getItem('products'));
    updateCart();
}

//Suppression d'un produit du panier puis mise à jour de la liste
function deleteItem(index){
    cartProducts.splice(index, 1);
    updateStorageItems();
}

//Vérification des inputs
function validateOrder(){
    console.log(document.getElementById('firstName').value);

    //Prénom
    let inFirstName = document.getElementById('firstName').value;
    if(inFirstName === ''){
        errors.firstName.push(ERR_FIRSTNAME_EMPTY);
    }

    //Nom
    let inLastName = document.getElementById('lastName').value;
    if(inLastName === ''){
        errors.lastName.push(ERR_LASTNAME_EMPTY);
    }

    console.log(Object.keys(errors).length);

    if(errors.length == 0){
        console.log("no error!");
    }
    else{
        console.log("errors!");
    }
}

function addError(input){

}