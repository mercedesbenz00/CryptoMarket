function ether(x){
  return web3.fromWei(x, "ether");
}
function toWei(x){
  return web3.toWei(x, "ether");
}

function showProductModal(id){

	market.products(id, function(err, res){
		market.productToSeller(id, function(err1, res1){
      if($("#confirm").length){
        $("#confirm").remove();
      }
      $("#quantity").val(0);
      $("#total").html("0");
			$("#productModal").find("#product_title").html(res[0]);
			$("#productModal").find("#product_description").html(res[1]);
			$("#productModal").find("#product_price").html(ether(res[2].toNumber()));
			$("#productModal").find("#product_quantity").html("Avaiable: "+res[3].toNumber()+" units");
			$("#productModal").find("#product_seller").html("Sold by: "+res1);
      $("#productModal").find("#product_id").html(id);
			$('#productModal').modal('show');
		})
	});
}
function addProduct(id, name, description, price, quantity, sellerAddress){
	var card = $(`<div class="col-lg-4 col-md-6 mb-4">
              <div class="card h-100">
                <div class="card-body">
                  <h4 class="card-title">
                    <a href="javascript:showProductModal(`+id+`)"; class="title"></a>
                  </h4>
                  <h5 class="price">ETHER </h5>
                  <p class="card-text description">description: </p>
                  <p class="card-text quantity">Available quantity: </p>
                  <p class="card-text">Product Id: <span class="pid"></span></p>
                </div>
                <div class="card-footer">
                  <p class="seller">Seller: </p>
                </div>
              </div>
            </div>
    `);

    card.find(".title").append(name);
    card.find(".description").append(description);
    card.find(".price").append(price);
    card.find(".quantity").append(quantity);
    card.find(".seller").append(sellerAddress);
    card.find(".pid").append(id);
    $("#row1").append(card);
}


$(function () {  // equivalent to $(document).ready(...)
  if (typeof(web3) === "undefined") {
    console.log("Unable to find web3. " +
          "Please run MetaMask (or something else that injects web3).");
    		$("#account_text").html("Hi! Something is gone wrong. Are you running a node? Please run MetaMask (or something else that injects web3).")
  } else {
    console.log("Found injected web3.");
    web3 = new Web3(window.web3.currentProvider);

  	market = web3.eth.contract(abi).at(address);
  	var coinbase = web3.eth.coinbase;
  	web3.eth.getBalance(coinbase, function(err, res){
  		var wei = JSON.stringify(res);
  		//var ether = wei.dividedBy(1000000000000000000);
  		$("#balance").append(res.toNumber()/1000000000000000000);
  	});

  	market.getProductLength(function(err, res){
  		for(let i = 0; i < res.toNumber(); i++){
  			market.products(i, function(err, res){
  				market.productToSeller(i, function(err1, res1){
  					addProduct(i, res[0], res[1], ether(res[2].toNumber()), res[3].toNumber(), res1);
  				})
  			});
  		}
  	});

    
  }   
});

$("#quantity").on("keyup", function(){
  var product_price = $("#product_price").text();
  var total = (product_price * $("#quantity").val());
  $("#total").html(web3.toWei(total, "ether"));
});

$("#buyProductBtn").on("click", function(){
  var confirm = $('<button type="button" class="btn btn-success" id="confirm" >Confirm your order!</button>')
  confirm.appendTo($("#modal-body"));
  confirm.on("click", function(){
    market.buyProduct(
        $("#productModal").find("#product_id").text(),
        $("#quantity").val(),
        $("#shippingAddress").val(),
        {from: web3.eth.coinbase.value, value: $("#total").html()},
        function(err, succ){
          $('#productModal').modal('hide');
        }
      )
  })
});
