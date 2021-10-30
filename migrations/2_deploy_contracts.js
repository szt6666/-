var Nft = artifacts.require("./Nft.sol");

module.exports = function(deployer) {
  deployer.deploy(Nft);
};
