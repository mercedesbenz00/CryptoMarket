
function addProduct(name, description, price, quantity, sellerAddress){
	var card = $(`<div class="col-lg-4 col-md-6 mb-4">
              <div class="card h-100">
                <div class="card-body">
                  <h4 class="card-title">
                    <a href="#" class="title"></a>
                  </h4>
                  <h5 class="price">ETHER </h5>
                  <p class="card-text description">description: </p>
                  <p class="card-text quantity">Available quantity: </p>
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
    $("#row1").append(card);
}

$(function () {  // equivalent to $(document).ready(...)
  if (typeof(web3) === "undefined") {
    console.log("Unable to find web3. " +
          "Please run MetaMask (or something else that injects web3).");
  } else {
    console.log("Found injected web3.");
    web3 = new Web3(window.web3.currentProvider);
    var address = "0x3fe0e8a50053d1df4c129f0c6ea4354f207a1fb1";
	var abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_n",
				"type": "string"
			},
			{
				"name": "_d",
				"type": "string"
			},
			{
				"name": "_p",
				"type": "uint256"
			},
			{
				"name": "_q",
				"type": "uint256"
			}
		],
		"name": "addProduct",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "sellerProductCounter",
		"outputs": [
			{
				"name": "",
				"type": "uint32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_id",
				"type": "uint256"
			},
			{
				"name": "_quantity",
				"type": "uint32"
			},
			{
				"name": "_shippingAddress",
				"type": "string"
			}
		],
		"name": "buyProduct",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "productToSeller",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_productId",
				"type": "uint256"
			}
		],
		"name": "removeProduct",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "products",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "description",
				"type": "string"
			},
			{
				"name": "price",
				"type": "uint256"
			},
			{
				"name": "quantity",
				"type": "uint32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_seller",
				"type": "address"
			}
		],
		"name": "getProductIdsBySeller",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getOwnOrders",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "orders",
		"outputs": [
			{
				"name": "shippingAddress",
				"type": "string"
			},
			{
				"name": "quantity",
				"type": "uint32"
			},
			{
				"name": "productId",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getProductLength",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

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
					addProduct(res[0], res[1], res[2].toNumber(), res[3].toNumber(), res1);
				})
			});
		}
	});


  }   
});
