pragma solidity ^0.4.19;
import "./SafeMath32.sol";

contract ProductBox {
    using SafeMath for uint32;

    struct Product {
        string name;
        string description;
        uint price;
        uint32 quantity;
    }

    Product[] public products;
    mapping(uint => address) public productToSeller;
    mapping(address => uint32) public sellerProductCounter;

    event NewProductCreated(address seller, uint productId);
    event ProductRemoved(uint productId);
    event ProductTerminatedAndRemoved(uint productId);

    modifier onlyProductOwner(uint _productId){
        require(productToSeller[_productId] == msg.sender);
        _;
    }

    function getProductLength() external view returns (uint) {
        return products.length;
    }

    function addProduct(string _n, string _d, uint _p, uint _q) public {
        uint _id = products.push(Product(_n, _d, _p, uint32(_q)));
        productToSeller[_id-1] = msg.sender;
        sellerProductCounter[msg.sender] = sellerProductCounter[msg.sender].add(1);
        NewProductCreated(msg.sender, _id-1);
    }

    function removeProduct(uint _productId) public onlyProductOwner(_productId) {
        products[_productId] = products[products.length - 1];
        productToSeller[_productId] = productToSeller[products.length - 1];
        products.length = products.length - 1;
        sellerProductCounter[msg.sender] = sellerProductCounter[msg.sender].sub(1);
        ProductRemoved(_productId);
    }

    function removeProductByQuantity(uint _productId, uint _quantity) internal {
        uint32 diff = uint32(products[_productId].quantity - _quantity);
        require(diff >= 0);
        if (diff == 0) {
            products[_productId] = products[products.length - 1];
            productToSeller[_productId] = productToSeller[products.length - 1];
            products.length = products.length - 1;
            ProductTerminatedAndRemoved(_productId);
        } else {
            products[_productId].quantity = diff;
        }
    }
}