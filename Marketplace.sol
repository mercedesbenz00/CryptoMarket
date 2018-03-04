pragma solidity ^0.4.19;
import "./ProductBox.sol";

contract Marketplace is ProductBox {

    struct Order {
        string shippingAddress;
        uint32 quantity;
        uint productId;
    }

    Order[] public orders;
    mapping(address => uint) sellerOrderCounter;

    function getOwnOrders() external view returns(uint[]) {
        uint[] memory orderIds = new uint[](sellerOrderCounter[msg.sender]);
        uint counter = 0;
        for (uint i = 0; i<orders.length; i++) {
            uint _id = orders[i].productId;
            if (productToSeller[_id] == msg.sender) {
                orderIds[counter] = _id;
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
        require(products[_id].price == msg.value);
        orders.push(Order(_shippingAddress, _quantity, _id));
        sellerOrderCounter[productToSeller[_id]] = sellerOrderCounter[productToSeller[_id]] + 1;
        sellProduct(_id, _quantity);
    }
    
}