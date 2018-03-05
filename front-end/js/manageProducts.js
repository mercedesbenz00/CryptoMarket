
function showProductModal(id){
	market.products(id, function(err, res){
		market.productToSeller(id, function(err1, res1){
			$("#productModal").find("#product_title").html(res[0]);
			$("#productModal").find("#product_description").html(res[1]);
			$("#productModal").find("#product_price").html("Price: "+res[2].toNumber()+" ETHER");
			$("#productModal").find("#product_quantity").html("Avaiable: "+res[3].toNumber()+" units");
			$("#productModal").find("#product_seller").html("Sold by: "+res1);
			$('#productModal').modal('show');
		})
	});
}

function deleteProduct(id){
	market.removeProduct(id, function(err, res){
		console.log(res);
		$("#id"+id).remove();
	});

}

function createProduct(){
	var title = $("#title").val();
	var description = $("#description").val();
	var price = $("#price").val();
	var quantity = $("#quantity").val();
	market.addProduct(title, description, price, quantity, function(err, res){
		if(err == null){
			console.log(res);
			// TODO: How to retrive the returned value?
			addProduct(res, title, description, price, quantity, "NULL");
		}
	})
}

function addProduct(id, name, description, price, quantity, sellerAddress){
	var card = $(`<div class="col-lg-4 col-md-6 mb-4" id="id`+id+`">
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
                  <button class="btn btn-danger" onclick="deleteProduct(`+id+`);">Delete Product</button>
                </div>
              </div>
            </div>
    `);

    card.find(".title").append(name);
    card.find(".description").append(description);
    card.find(".price").append(price);
    card.find(".quantity").append(quantity);
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

	market.getProductIdsBySeller(coinbase, function(err, res){
		console.log(res);
		for(let i = 0; i < res.length; i++){
			market.products(res[i].toNumber(), function(err, res1){
					addProduct(res[i].toNumber(), res1[0], res1[1], res1[2].toNumber(), res1[3].toNumber());
			});
		}
	});


  }   
});
