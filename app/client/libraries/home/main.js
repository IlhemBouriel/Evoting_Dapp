Session.set('NumberOfOptions', 2);
Meteor.subscribe('poll_listings');


var accounts = new Accounts({minPassphraseLength: 6});


Template.registerHelper('and',(a,b)=>{
  return a && b;
});
Template.registerHelper('or',(a,b)=>{
  return a || b;
});

Template.timelimit.helpers({
  hours: function(){
    return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
  },
  days: function() {
    return [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
  }
});

Template.datepicker.rendered=function() {
	$('#datepicker').datepicker();
}

Template.poll_listed.helpers({
  countpolls: function() {
    var user = getUserBySession(getSessionToken())
    return (poll.find({"poll.isactive":false, owner: user._id}).count() > 0);
  },
  six_polls: function() {
    var user = getUserBySession(getSessionToken())
    var all_polls = poll.find({"poll.isactive":false, owner: user._id}, {sort: {createdAt: -1}}).fetch();
    return all_polls.slice(0,6);
  },
  get_votes: function() {
    var cur_poll = this;
    var vote_limit = cur_poll.poll.vote_limit;

    if (cur_poll.votes) {
      if (vote_limit) {
        return cur_poll.votes.length + "/" + vote_limit;
      }
      else {
        return cur_poll.votes.length;
      }
    }
    else {
      if (vote_limit) {
        return "0 /" + vote_limit;
      }
      else {
        return 0
      }
    }
  }
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

Template.poll_listed.events({
  'click #registerVoter': function(event) {
              
    console.log('Register')
    var current_poll = $(event.currentTarget).attr('pollid');
    var isready = $(event.currentTarget).attr('isready')
    console.log(isready)
    var voterEmail = prompt("Enter voter email : ", "Email here");
    console.log(voterEmail)
    if(voterEmail && validateEmail(voterEmail)) {
      Meteor.call('register_voter', voterEmail, current_poll, function(error, success) {
        if(!error) {
            new Confirmation({
              message: "Thanks for registering ! an email has been sent to you",
              title: "Confirmation",
              okText: "Ok",
              success: true,
            }, function (ok) {
                console.log('/vote/'+ current_poll +'/register/' + success);


      //add the voter to the poll contract
  /*    var current_poll = $(event.currentTarget).attr('pollid');
      Meteor.call('get_accounts', current_poll, function(error,success){
      accounts.clear();
      accounts.import(success.account)
      var unlocked = accounts.get(success.address)
      var abi = success.contract_abi;
      var address = success.contract_address;
      var contract = web3.eth.contract(abi).at(address);
      var option = event.target.id;

      var gasprice = web3.eth.gasPrice.toString(10);

      contract.get_num_voters({from: success.address, account: unlocked, gas: 200000, gasPrice: gasprice}, function(error,success) {
        if(success) {
           console.log("num of voters " + success);
        }

      });

    });*/
//////////////////////
            });


        }
      })
    }
  }
})


Template.registerVoter.events({
  'click #submitRegister': function(event) {
    var voter_id = Router.current().params._userId
    console.log(voter_id)
    event.preventDefault();
    var voter = {
      'name': '',
      'cin': '',
      'birth':'',
      'gov':'',
      'password': '',
      'fakePassword': ''
    }

    voter['name']= $('#register').find('#full_name').val();
    voter['cin'] = $('#register').find('#cin').val();
    voter['birth']= $('#register').find('#datepicker').val();
    voter['gov'] = $('#register').find('#gouvernerat').val();
    voter['password'] = $('#register').find('#password').val();
    voter['fakePassword'] = $('#register').find('#fakePassword').val();
    Meteor.call('update_voter', voter_id, voter['name'], voter['cin'], voter['birth'], voter['gov'], voter['password'], voter['fakePassword'], function(error, success) {
      if(!error) {
        Router.go('/')
      }
    })
  }
})

Template.registerVoter.helpers({
  current_poll:function(){
    return this.params._id;
  },
  voter_id:function(){
    return this.params._userId;
  }
})


Template.more_options.events({
  'click #add_option' : function () {
    console.log('Add option')
    //Update session storage for NumberOfOptions
    var numOptions = Session.get('NumberOfOptions') + 1;

    if (numOptions <= 10) {
      //Create new DOM element for additional Option
      var new_option = document.createElement("div");
      new_option.className = "form-group";
      new_option.innerHTML = '<input id="option-' + numOptions + '" type="text" value="" maxlength="20" placeholder="Option ' + numOptions +'" class="form-control poll_options" />';
      document.getElementById('options').appendChild(new_option);

      Session.set('NumberOfOptions', numOptions);
    }
  },
  'click #rmv_option' : function() {
    var numOptions = Session.get('NumberOfOptions');

    if (numOptions > 2) {
      var elementId = 'option-' + numOptions;
      var element_to_remove = document.getElementById(elementId).parentNode;
      document.getElementById('options').removeChild(element_to_remove);

      //Update Session
      Session.set('NumberOfOptions', numOptions - 1);
    }
  }
});

Template.main.events({
  'click #submit': function(event) {
    event.preventDefault();
    num_options = Session.get('NumberOfOptions');
    var poll = {
      'name': '',
      'description': '',
      'options':'',
      'isactive':false,
      'ready':false,
      'voter': []
    }

    poll['name']= $('#name_poll').val();
    poll['description'] = $('#description').val();
    var option = [];
    for (var i = 1; i <= num_options; i++) {
      element_id = "#option-" + i;
      option.push($(element_id).val());
    }

    poll['options'] = option;

    poll['deadline'] = Date.parse($('#datepicker').val());

    Meteor.call('post_data', getSessionToken(), poll, function(error, success) {
      Router.go('vote', {_id: success});
    });
  }
});
