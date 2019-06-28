var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    askAction();
})

function readProducts(){
    connection.query("SELECT * FROM products", function (err, res){
        if (err) throw err;
        console.log('****** Our products! ******\n');
        for (let i = 0; i < res.length; i++){
            console.log('ID: ' + res[i].item_id
            + ' - ' + res[i].product_name
            + ' - ' + res[i].department_name
            + ' - $ ' + res[i].price
            + ' - ' + res[i].stock_quantity) + ' unit(s).';
        }
        console.log('******\n');
        askAction();
    }); //connection.query
}

function askAction(){
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What are you up to?",
            choices: [
                "See all products",
                "Buy an item",
                "Exit"
            ]
        }
    ]).then(function(answers){ // inquirer.prompt
        switch (answers.action){
            case 'See all products':
                readProducts();
                break;

            case 'Buy an item':
                promptBuyItem();
                break;

            case 'Exit':
                exit();
                break;
        }
    }); // inquirer.prompt().then()
}

/**
 * Buying item
 */

function promptBuyItem(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'itemToBuy',
            message: 'Please introduce the id of the item you want to buy.'
        },
        {
            type: 'input',
            name: 'amountToBuy',
            message: 'Please introduce the amount of items you want to buy.'
        }
    ]).then(function(answers){ // inquirer.prompt()
        buyItem(answers.itemToBuy, answers.amountToBuy);
    }); // inquirer.prompt().then();
}

function buyItem(id, amount) {
    connection.query('SELECT * FROM products WHERE ?',
        [
            {
                item_id: id
            }
        ], function (err, res) {
                if (err) throw err;
                if (parseInt(res[0].stock_quantity) >= parseInt(amount)) {
                    var total = parseInt(res[0].price) * amount;
                    updateProduct(id, res[0].stock_quantity, amount);
                    console.log("You bought " + amount + ' ' + res[0].product_name + " for a total of: $ " + total + "\n");
                    console.log("****** Thanks for buying! ******")
                }else {
                    console.log("We don't have enough units of the requested item, try again later!\n");
                    askAction();
                }
        });
}

function updateProduct(id, originalStock, amountToReduce) {
    console.log("****** Updating stock ******\n");
    var remaining = parseInt(originalStock) - parseInt(amountToReduce);
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: remaining
            },
            {
                item_id: id
            }
        ],
        function (err, res) {
            askAction();
        }
    );
}

/**
 * Exit
 */

function exit() {
    connection.end();
}