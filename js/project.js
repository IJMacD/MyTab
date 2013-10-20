$(function(){
	var cardList = $('#list'),
		cardNew = $('.card-new'),
		cardNewCell = cardNew.parent(),

		people = {ijmacd:{name:"Iain MacDonald",balance:-1620,transactions:[]},anna:{name:"Anna Coyle",balance:420,transactions:[]},steph:{name:"Steph Gadd",balance:-800,transactions:[]},mike:{name:"Mike Hornsey",balance:2000,transactions:[]}},transactions=[{from:people.ijmacd,to:people.anna,amount:420,date:"2013-09-16T20:41:00"},{from:people.steph,to:people.ijmacd,amount:1000,date:"2013-09-18T12:06:00"},{from:people.ijmacd,to:people.steph,amount:200,date:"2013-09-21T11:38:00"},{from:people.ijmacd,to:people.mike,amount:2000,date:"2013-10-01T10:18:00"}],
		subject = people.ijmacd;

	$.each(transactions, function(i,transaction){
		transaction.from.transactions.push(transaction);
		transaction.to.transactions.push(transaction);
	});

	$.each(people, function(i, person){
		if(person != subject){
			addCard(person);
		}
	});

	cardList.on("click", ".btn-primary", function(e){
		var person = $(e.target).parent().parent().parent().data("person");
		if(person){
			addBill(subject, [person], prompt("Split bill with " + person.name));
		}
	});

	cardList.on("click", ".btn-success", function(e){
		var person = $(e.target).parent().parent().parent().data("person");
		if(person){
			addTransaction(subject, person, prompt("Give money to " + person.name)*1);
		}
	});

	cardList.on("click", ".btn-default", function(e){
		var person = $(e.target).parent().parent().parent().data("person");
		if(person){
			alert("View details of " + person.name);
		}
	});

	cardNew.find(".btn").on("click", function(e){
		addPerson(prompt("New Person's Name"));
	});

	function addPerson(name){
		var person = {
			name: name,
			balance: 0,
			transactions:[]
		};
		people[name] = person;
		addCard(person);
	}

	function addCard(person){
		var neg = person.balance < 0,
			cell = $('<div>').addClass("col-md-4 col-sm-6"),
			card = $('<div>').addClass("card").appendTo(cell),
			name = $('<h2>').text(person.name).appendTo(card),
			amnt = $('<p>').addClass(neg ? "neg" : "").text(formatBalance(person.balance)).appendTo(card),
			buttons = $("<p>").appendTo(card),
			billBtn = $("<a>").addClass("btn btn-primary").attr("href", "#").text("Add Bill").appendTo(buttons),
			payBtn = $("<a>").addClass("btn btn-success").attr("href", "#").text("Add Payment").appendTo(buttons.append(" ")),
			detailBtn = $("<a>").addClass("btn btn-default").attr("href", "#").text("View Details »").appendTo(buttons.append(" "));
		person.card = {card:card,name:name,balance:amnt};
		cell.data("person", person);
		cell.insertBefore(cardNewCell);
	}

	function updateCard(person){
		if(person.card){
			person.card.name.text(person.name);
			person.card.balance.text(formatBalance(person.balance));
			person.card.balance.toggleClass("neg", person.balance < 0);
		}
	}

	function formatBalance(balance){
		var neg = balance < 0,
			balance = neg ? -balance : balance;
		return (neg ? "-$" : "$") + balance.toFixed(2);
	}

	function addBill(personPaid, peopleShared, amount){
		var peopleCount = peopleShared.length + 1,
			amountEach = amount / peopleCount;
		$.each(peopleShared, function(i,person){
			//person.balance -= amountEach;
			//updateCard(person);
			addTransaction(personPaid, person, amountEach);
		});
	}

	function addTransaction(from, to, amount){
		from.balance -= amount;
		transaction = {from:from,to:to,amount:amount,date:Date.now()};
		transactions.push(transaction);
		from.transactions.push(transaction);
		updateCard(from);
		if(to){
			to.balance += amount;
			to.transactions.push(transaction);
			updateCard(to);
		}
	}
});