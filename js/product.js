const urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get('id');

fetch("http://localhost:3000/api/products/" + id).then(function(result){
                if(result.ok){
                  return result.json();
                }
              }).then(function(value){
                console.log(value);
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