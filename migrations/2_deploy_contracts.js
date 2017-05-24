var NewPoll = artifacts.require("./NewPoll.sol");
var Evote = artifacts.require("./Evote.sol");
module.exports = function(deployer) {
  deployer.deploy(NewPoll);
  deployer.deploy(Evote);
};
