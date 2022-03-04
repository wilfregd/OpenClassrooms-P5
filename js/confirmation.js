const urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get('id');

document.getElementById("orderId").innerHTML = id;