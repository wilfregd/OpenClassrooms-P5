//Obtention des produits et affichage sur la page
fetch("http://localhost:3000/api/products").then(function(result){
                if(result.ok){
                  return result.json();
                }
              }).then(function(value){
                drawProduct(value);
              }).catch(function(error){
                console.log(error);
              });

              //Afficher les données de chaque produit l'un après l'autre dans l'élément "items"
              function drawProduct(product){
                for(var i = 0; i < product.length; i++){
                  var id = product[i]._id;
                  var name = product[i].name;
                  var alt = product[i].altTxt;
                  var description = product[i].description;
                  var img = product[i].imageUrl;

                  var htmlStr = 
                  "<a href='./product.html?id=" + id + "'>" +
                    "<article>" +
                      "<img src='" + img +"' alt='" + alt + "'>" +
                      "<h3 class='productName'>" + name  +"</h3>" +
                      "<p class='productDescription'>" + description + "</p>" +
                    "<article>" +
                  "</a>";

                  document.getElementById("items").innerHTML += htmlStr;
                }
            }