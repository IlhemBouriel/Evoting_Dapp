var accounts = new Accounts({minPassphraseLength: 6});
var min_balance;
var ethaccount;

Template.registerHelper("option_count", function(count) {
  if (count == 2) {
    return "true";
  }
});

Template.vote.helpers({
  single_option: function(index, options) {
    return options[index];
  }
});

Template.not_ready.helpers({
  contract_cost: function() {
    min_balance = 0.2;
    return min_balance;
  }
});

Template.vote.events({
  'click .option_click': function(event) {
    var current_poll = $(event.currentTarget).attr('pollid');
    Meteor.call('get_accounts', current_poll, function(error,success){
      accounts.clear();
      accounts.import(success.account)
      var unlocked = accounts.get(success.address)
      var abi = success.contract_abi;
      var address = success.contract_address;
      var contract = web3.eth.contract(abi).at(address);
      var option = event.target.id;

      var gasprice = web3.eth.gasPrice.toString(10);
      var voter_id_blockchain = getUserBySession(getSessionToken()).email;


 contract.get_candidate(option,{from: success.address, account: unlocked, gas: 200000, gasPrice: gasprice}, function(error,success) {
        if(success) {
           console.log("candidate ==> " + success);
        }

      });

 contract.register_candidate("option",{from: success.address, account: unlocked, gas: 200000, gasPrice: gasprice}, function(error,success) {
        if(success) {
           console.log("candidate ==> " + success);
        }

      });

  contract.get_candidate(option,{from: success.address, account: unlocked, gas: 200000, gasPrice: gasprice}, function(error,success) {
        if(success) {
           console.log("candidate ==> " + success);
        }

      });
 contract.get_num_voters({from: success.address, account: unlocked, gas: 200000, gasPrice: gasprice}, function(error,success) {
        if(success) {
           console.log(" num voter ==>" + success);
        }

      });

  contract.register_voter("voter",{from: success.address, account: unlocked, gas: 200000, gasPrice: gasprice}, function(error,success) {
        if(success) {
           console.log(" num voter ==>" + success);
        }

      });


 contract.get_num_voters({from: success.address, account: unlocked, gas: 200000, gasPrice: gasprice}, function(error,success) {
        if(success) {
           console.log(" num voter ==>" + success);
        }

      });






      contract.vote("boter","option", {from: success.address, account: unlocked, gas: 200000, gasPrice: gasprice}, function(error,success) {
        if(success) {
          console.log('done');
            contract.get_candidate(option,{from: success.address, account: unlocked, gas: 200000, gasPrice: gasprice}, function(error,success) {
        if(success) {
           console.log("num of voters " + success);
        }

      });
          Meteor.call('post_vote', current_poll, event.target.id, function(error, success){
            if(success) {
              var route = "/vote/" + current_poll + "/voted";
              Router.go(route);
            }
          });
        }
        else
        {
          console.log("error");
        }
      })
    });
  },
  'click .get_address': function() {
    var current_poll = this;
    console.log(accounts.list())
    // TODO: Include preformated transaction for client
    if(current_poll.address) {
      var element = document.getElementById('eth_address');
      element.innerHTML = "<input type='text' class='form-control' style='margin:0 auto; width:280px;' value='" + current_poll.address + "'></input>"
    }
    else {
      function generatePassword() {
          var length = 12,
              charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*'#-.,;:_!$%&/()=?'{}[]+",
              retVal = "";
          for (var i = 0, n = charset.length; i < length; ++i) {
              retVal += charset.charAt(Math.floor(Math.random() * n));
          }
          return retVal;
      }
      var passphrase = generatePassword();
      var ethaccount = accounts.new(passphrase);
      var unlocked = accounts.get(ethaccount['address'], passphrase);

      var exported1 = '{"' + ethaccount['address'] + '":';
      var exported2 = JSON.stringify(unlocked);
      var exported3 = ',"selected":"' + ethaccount['address'] + '"}';
      var exported = exported1 + exported2 + exported3;

      Meteor.call('store_account', this._id, ethaccount['address'], exported, function(error, success) {
        if(success) {
          var element = document.getElementById('eth_address');
          element.innerHTML = "<input type='text' class='form-control' style='margin:0 auto; width:280px;' value='" + ethaccount['address'] + "'></input>"
        }
      });
    }
  },
  'click .start_poll': function() {
    var current_poll = this;
    Meteor.call('get_accounts', this._id, function(error,success) {
      $('.start_poll').addClass('disabled');
      var element = document.getElementById('patience');
      element.innerHTML = "<h7>Received your request, this could take a few minutes.</h7>";
      accounts.import(success.account);
      var unlocked = accounts.get(success.address);
      var gasprice = web3.eth.gasPrice.toString(10);
      var cur_date = Date.now();

      var _deadline = parseInt(current_poll.poll.deadline);
      var _opts = current_poll.poll.options;
      var _options = JSON.stringify(current_poll.poll.options);
      var _votelimit = 0;
      var _title = current_poll.poll.name;

      console.log(_deadline + " " + _options + " " + _votelimit + " " + _title)

     // var newpollContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"endPoll","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"p","outputs":[{"name":"owner","type":"address"},{"name":"title","type":"string"},{"name":"votelimit","type":"uint256"},{"name":"options","type":"string"},{"name":"deadline","type":"uint256"},{"name":"status","type":"bool"},{"name":"numVotes","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"choice","type":"string"}],"name":"vote","outputs":[{"name":"","type":"bool"}],"type":"function"},{"inputs":[{"name":"_options","type":"string"},{"name":"_title","type":"string"},{"name":"_votelimit","type":"uint256"},{"name":"_deadline","type":"uint256"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"votechoice","type":"string"}],"name":"NewVote","type":"event"}]);
      var newpollContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"get_authority","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"duration","type":"uint256"}],"name":"start_election","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"string"}],"name":"register_candidate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"i","type":"string"}],"name":"get_votes","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get_num_candidates","outputs":[{"name":"num","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"adr","type":"address"}],"name":"set_authority","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"string"}],"name":"register_voter","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"i","type":"string"}],"name":"get_candidate","outputs":[{"name":"_votes","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get_num_voters","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"string"},{"name":"id","type":"string"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_title","type":"string"},{"name":"_deadline","type":"uint256"}],"payable":false,"type":"constructor"}]);
      var newpoll = newpollContract.new(
         //_options,
         _title,
         //_votelimit,
         _deadline,
         {
           from: unlocked['address'],
          // from: web3.eth.accounts[0],
           account: unlocked,
          // data: '60606040526040516106f93803806106f9833981016040528080518201919060200180518201919060200180519060200190919080519060200190919050505b33600060005060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055508360006000506003016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100c557805160ff19168380011785556100f6565b828001600101855582156100f6579182015b828111156100f55782518260005055916020019190600101906100d7565b5b5090506101219190610103565b8082111561011d5760008181506000905550600101610103565b5090565b50508260006000506001016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061017857805160ff19168380011785556101a9565b828001600101855582156101a9579182015b828111156101a857825182600050559160200191906001019061018a565b5b5090506101d491906101b6565b808211156101d057600081815060009055506001016101b6565b5090565b505081600060005060020160005081905550806000600050600401600050819055506001600060005060050160006101000a81548160ff0219169083021790555060006000600050600601600050819055505b505050506104c0806102396000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480638d99b2eb1461004f5780639ae8886a14610072578063fc36e15b146101d95761004d565b005b61005c600480505061042d565b6040518082815260200191505060405180910390f35b61007f6004805050610243565b604051808873ffffffffffffffffffffffffffffffffffffffff16815260200180602001878152602001806020018681526020018581526020018481526020018381038352898181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156101405780601f1061011557610100808354040283529160200191610140565b820191906000526020600020905b81548152906001019060200180831161012357829003601f168201915b50508381038252878181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156101c35780601f10610198576101008083540402835291602001916101c3565b820191906000526020600020905b8154815290600101906020018083116101a657829003601f168201915b5050995050505050505050505060405180910390f35b61022d6004808035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506102b0565b6040518082815260200191505060405180910390f35b60006000508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806001016000509080600201600050549080600301600050908060040160005054908060050160009054906101000a900460ff16908060060160005054905087565b6000600060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614158061032b57506001600060005060050160009054906101000a900460ff1614155b156103395760009050610428565b600160006000506006016000828282505401925050819055507f24bcf19562365f6510754002f8d7b818d275886315d29c7aa04785570b97a3638260405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156103d45780820380516001836020036101000a031916815260200191505b509250505060405180910390a16000600060005060020160005054111561041f5760006000506002016000505460006000506006016000505410151561041e5761041c61042d565b505b5b60019050610428565b919050565b6000600060005060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561049557600090506104bd565b6000600060005060050160006101000a81548160ff02191690830217905550600190506104bd565b9056',
           data: '6060604052341561000c57fe5b604051610ea9380380610ea9833981016040528080518201919060200180519060200190919050505b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806002819055506001600360006101000a81548160ff02191690831515021790555081600090805190602001906100ae9291906100c7565b506000600a8190555060006009819055505b505061016c565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061010857805160ff1916838001178555610136565b82800160010185558215610136579182015b8281111561013557825182559160200191906001019061011a565b5b5090506101439190610147565b5090565b61016991905b8082111561016557600081600090555060010161014d565b5090565b90565b610d2e8061017b6000396000f300606060405236156100a2576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063099317d2146100a45780632de096ff146100f65780634af5f6521461011657806350b072f414610170578063668d8b92146101de5780637269cdf61461020457806390bc7b371461023a5780639d00ce7514610294578063cf64b68f14610302578063e8d5940d14610328575bfe5b34156100ac57fe5b6100b46103c5565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100fe57fe5b61011460048080359060200190919050506103f0565b005b341561011e57fe5b61016e600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505061045b565b005b341561017857fe5b6101c8600480803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506105d6565b6040518082815260200191505060405180910390f35b34156101e657fe5b6101ee61064a565b6040518082815260200191505060405180910390f35b341561020c57fe5b610238600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610655565b005b341561024257fe5b610292600480803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506106f8565b005b341561029c57fe5b6102ec600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610873565b6040518082815260200191505060405180910390f35b341561030a57fe5b6103126108e7565b6040518082815260200191505060405180910390f35b341561033057fe5b6103c3600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506108f2565b005b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b90565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561044d5760006000fd5b8042016002819055505b5b50565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156104b85760006000fd5b806004816040518082805190602001908083835b602083106104ef57805182526020820191506020810190506020830392506104cc565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060009054906101000a900460ff161561053b5760006000fd5b60016004836040518082805190602001908083835b602083106105735780518252602082019150602081019050602083039250610550565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060006101000a81548160ff021916908315150217905550600a600081548092919060010191905055505b5b505b50565b60006005826040518082805190602001908083835b6020831061060e57805182526020820191506020810190506020830392506105eb565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390205490505b919050565b6000600a5490505b90565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156106b25760006000fd5b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b50565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156107555760006000fd5b806006816040518082805190602001908083835b6020831061078c5780518252602082019150602081019050602083039250610769565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060009054906101000a900460ff16156107d85760006000fd5b60016006836040518082805190602001908083835b6020831061081057805182526020820191506020810190506020830392506107ed565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060006101000a81548160ff0219169083151502179055506009600081548092919060010191905055505b5b505b50565b60006005826040518082805190602001908083835b602083106108ab5780518252602082019150602081019050602083039250610888565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390205490505b919050565b600060095490505b90565b816006816040518082805190602001908083835b602083106109295780518252602082019150602081019050602083039250610906565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060009054906101000a900460ff1615156109765760006000fd5b826007816040518082805190602001908083835b602083106109ad578051825260208201915060208101905060208303925061098a565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060009054906101000a900460ff1615610adc57600160056008836040518082805190602001908083835b60208310610a2d5780518252602082019150602081019050602083039250610a0a565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390206040518082805460018160011615610100020316600290048015610abb5780601f10610a99576101008083540402835291820191610abb565b820191906000526020600020905b815481529060010190602001808311610aa7575b50509150509081526020016040518091039020600082825403925050819055505b60016005846040518082805190602001908083835b60208310610b145780518252602082019150602081019050602083039250610af1565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060008282540192505081905550826008856040518082805190602001908083835b60208310610b8b5780518252602082019150602081019050602083039250610b68565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390209080519060200190610bd1929190610c5d565b5060016007856040518082805190602001908083835b60208310610c0a5780518252602082019150602081019050602083039250610be7565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902060006101000a81548160ff0219169083151502179055505b5b505b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610c9e57805160ff1916838001178555610ccc565b82800160010185558215610ccc579182015b82811115610ccb578251825591602001919060010190610cb0565b5b509050610cd99190610cdd565b5090565b610cff91905b80821115610cfb576000816000905550600101610ce3565b5090565b905600a165627a7a7230582028b7ca9d420f26dd0a3c0334e0d80442ceabdc63ed179ab0270a369d5c27d5520029',
           gas: 3000000,
           gasPrice: gasprice
         }, function(e, contract){
          if (typeof contract.address != 'undefined') {
            console.log('Contract mined! address: ' + contract.address);
            //Adding candidates to the poll contract
             for(var i=0;i<_opts.length;i++)
            {
              console.log(_opts[i]);
           contract.register_candidate(_opts[i],{from: web3.eth.accounts[0], account: unlocked, gas: 200000, gasPrice: gasprice}, function(error,success) {
            if(success) {
            console.log("new candidate has been inserted");
            
            }
          });

            }

            //Adding poll's creator as a voter to the poll 
           contract.register_voter(getUserBySession(getSessionToken()).email,{from: web3.eth.accounts[0], account: unlocked, gas: 200000, gasPrice: gasprice}, function(error,success) {
            if(success) {
            console.log(getUserBySession(getSessionToken()).email+" is inserted as a voter");
            
            }
          });
           
            


            var blocknum = web3.eth.blockNumber;

            //var contractAbi = [{"constant":false,"inputs":[],"name":"endPoll","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"p","outputs":[{"name":"owner","type":"address"},{"name":"title","type":"string"},{"name":"votelimit","type":"uint256"},{"name":"options","type":"string"},{"name":"deadline","type":"uint256"},{"name":"status","type":"bool"},{"name":"numVotes","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"choice","type":"string"}],"name":"vote","outputs":[{"name":"","type":"bool"}],"type":"function"},{"inputs":[{"name":"_options","type":"string"},{"name":"_title","type":"string"},{"name":"_votelimit","type":"uint256"},{"name":"_deadline","type":"uint256"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"votechoice","type":"string"}],"name":"NewVote","type":"event"}]
            var contractAbi = [{"constant":true,"inputs":[],"name":"get_authority","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"duration","type":"uint256"}],"name":"start_election","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"string"}],"name":"register_candidate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"i","type":"string"}],"name":"get_votes","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get_num_candidates","outputs":[{"name":"num","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"adr","type":"address"}],"name":"set_authority","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"string"}],"name":"register_voter","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"i","type":"string"}],"name":"get_candidate","outputs":[{"name":"_votes","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get_num_voters","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"string"},{"name":"id","type":"string"}],"name":"vote","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_title","type":"string"},{"name":"_deadline","type":"uint256"}],"payable":false,"type":"constructor"}];
            Meteor.call('make_live', contractAbi, contract.address, current_poll._id, blocknum, cur_date, _deadline);
          }
       });
    });
  }
});

