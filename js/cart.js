const storage = window.localStorage;

//On récupère les produits du stockage local
var cartProducts = [];
let jsonStr = storage.getItem('products');
if(jsonStr){
    cartProducts = JSON.parse(jsonStr);
}

console.log(cartProducts);

let totalQuantity = 0;
let totalPrice = 0;

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

        totalQuantity++;
        totalPrice += (parseInt(quantity) * parseFloat(productInfo.price));

        document.getElementById('cart__items').innerHTML += htmlStr;
    }

    //Fonctionnalité des boutons "supprimer"
    var buttons = document.getElementsByClassName('deleteItem');

    for(let i = 0; i < buttons.length; i++){

        //TODO finish this
        let deleteBtn = buttons[i];
        deleteBtn.onclick = function(){
            deleteItem(i);
        };
    }

    //Prix total
    //TODO sécuriser sur le serveur
    document.getElementById('totalQuantity').innerHTML = totalQuantity.toString();
    document.getElementById('totalPrice').innerHTML = totalPrice.toString();
}

function deleteItem(num){

    //Get array without current product
    const newProducts = cartProducts.splice(num, 1);

    const jsonStr = JSON.stringify(cartProducts);
    storage.setItem('products', jsonStr);

    console.log(storage.getItem('products'));

    location.reload();
}