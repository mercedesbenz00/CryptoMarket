pragma solidity ^0.4.19;
import "./ProductBox.sol";
import "./Destructible.sol";

contract Marketplace is ProductBox, Destructible {

    struct Order {
        string shippingAddress;
        uint32 quantity;
        uint productId;
    }

    Order[] public orders;
    mapping(address => uint) public sellerOrderCounter;
    mapping(address => uint) public moneyToHave;
    mapping(address => string) public publicPGPKeys;
    
    event ShippedOrder(uint _orderId);

    function setShipped(uint _id) external {
        removeOrder(_id);
        ShippedOrder(_id);
    }
    
    function publicPGPKeys(string _key) external {
        publicPGPKeys[msg.sender] = _key;
    }
    
    function getBalance() external view onlyOwner returns ( uint ) {
        return this.balance;
    }

    function withdrawMoney() external {
        require(moneyToHave[msg.sender] > 0);
        msg.sender.transfer(moneyToHave[msg.sender]);
    }

    function removeOrder(uint _id) internal {
        orders[_id] = orders[orders.length - 1];
        sellerOrderCounter[productToSeller[_id]] = sellerOrderCounter[productToSeller[_id]] - 1;
        orders.length--;
    }

    function getOrdersToShip() external view returns(uint[]) {
        uint[] memory orderIds = new uint[](sellerOrderCounter[msg.sender]);
        uint counter = 0;
        for (uint i = 0; i<orders.length; i++) {
            uint _id = orders[i].productId;
            if (productToSeller[_id] == msg.sender) {
                orderIds[counter] = i;
                counter++;
            }
        }
        return orderIds;
    }


    function getProductIdsBySeller(address _seller) external view returns(uint[]) {
        uint[] memory productIds = new uint[](sellerProductCounter[_seller]);
        uint counter = 0;
        for (uint i = 0; i<products.length; i++) {
            if (productToSeller[i] == _seller) {
                productIds[counter] = i;
                counter++;
            }
        }
        return productIds;
    }

    function buyProduct(uint _id, uint32 _quantity, string _shippingAddress) external payable {
        require(products[_id].price*_quantity == msg.value);
        orders.push(Order(_shippingAddress, _quantity, _id));
        sellerOrderCounter[productToSeller[_id]] = sellerOrderCounter[productToSeller[_id]] + 1;
        removeProductByQuantity(_id, _quantity);
        moneyToHave[productToSeller[_id]] = moneyToHave[productToSeller[_id]] + msg.value;
    }
    
}