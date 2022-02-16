//Variables
const storage = window.localStorage;
var cartProducts = [];
let totalQuantity = 0;
let totalPrice = 0;

//Update initial
updateCart();

//Update dessine
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

            //Le prix final est additionné
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

        //Prix total
        updatePrice();
    }
}

function updatePrice(){

    //On obtiens tout les éléments

    document.getElementById('totalQuantity').innerHTML = totalQuantity.toString();
    document.getElementById('totalPrice').innerHTML = totalPrice.toString();
}

function clearCart(){

    //On supprime les entrées du DOM
    let container = document.getElementById('cart__items');
    if(container.childElementCount > 0){
        container.innerHTML = "";
    }

    //Le total est remis à 0
    totalQuantity = 0;
    totalPrice = 0;

    updatePrice();
}

function getCartProducts(){
    let products = [];

    let jsonStr = storage.getItem('products');
    if(jsonStr){
        products = JSON.parse(jsonStr);
    }

    return products;
}

function updateQuantity(index, obj){
    cartProducts[index].quantity = obj.value;
    updateStorageItems();
}

function updateStorageItems(){
    const jsonStr = JSON.stringify(cartProducts);
    storage.setItem('products', jsonStr);
    console.log(storage.getItem('products'));
    updateCart();
}

function deleteItem(index){
    cartProducts.splice(index, 1);
    updateStorageItems();
}