////////////////////////////////////////////////
//Module 1: BUDGET CONTROLLER. Create IIFE to keep data safe. Independent.
let budgetController = (function() {
    //creating a constructor for expenses. this.id = id; means that the value passed in as the id parameter is the value for this.id.
    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1; // -1 is default if not defined otherwise.
    };

    //adding method to the Expense Prototype.
    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round(this.value / totalIncome * 100);
        } else {
            this.percentage = -1;
        }
    };

    //adding get method to the Expense Prototype
    Expense.prototype.getPercentage = function() {
        return this.percentage;
        //console.log(this.percentage);
    };

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //Making the calculateBudget method private. Call this method in the `calculateBudget` method below.

    calculateTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value; //Adds cur.value to the sum each loop. `value` is from the `Income` and `Expense` variables above that have `this.value`. So `cur` refers t the Income or the Expense at the current position in the array.
        });

        data.totals[type] = sum; // sets the data.totals below to sum.
    };

    //creating an object to hold all of the income and expenses. It has two objects wihtin an object: allItems and totals within data.exp = Expense; inc = income

    let data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        },
        // represents the total difference between `totals.inc` - `totals.exp`.
        budget: 0,

        //property to hold the percentage of the income that an expense represents.
        percentage: -1 // -1 one is used because it represents a value that is non-existent. We know there is an error if the value is -1.
    };

    //Creating a public method that will allow other modules to add new items into data structure. Parameters: type of item (income or expense), description, value.
    return {
        addItem: function(type, des, val) {
            var newItem;
            //Create Unique ID for each item. Create if statement so that if there are no previous id's, the id is set to 0. If we don't do this, the length is 0, so subtracting 1 gives us -1, which is not acceptable.
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Create new item. Determining what to do based on the type of item. The values 'exp' and 'inc' are defined in the HTML. These values are also values in the allItems object in the data object above. This is important for the data.allItems[type].push(newItem); below.
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //adding item to data object above. The [type] comes from the type passed in to the addItem function.
            data.allItems[type].push(newItem);
            //return new element
            return newItem;
        },
        // Deleting an item from the UI. We need to know if we are dealing with an expense or an income, as well as the unique ID.
        deleteItem: function(type, id) {
            let ids, index;
            //create an arrray with all of the id's. Find out the index of the element we want to remove. So, loop over the elements.

            ids = data.allItems[type].map(function(current) {
                return current.id; //returns an array with all the ids. Example: [1, 2, 4, 9, 12].
            });

            // `indexOf` returns the index number of the element of the array that is passed as the `id` parameter. So if the array is [1, 2, 4, 9, 12] and we are search for `9`, `indexOf` will return `3`. So, `index` will be `3`.
            index = ids.indexOf(id);

            //delete the index. We only want to remove something if the index actually exists. So, we create an if statement that if the index is not -1 (i.e., it exists because -1 will never exist), then delete.
            if (index !== -1) {
                data.allItems[type].splice(index, 1); // `splice` will start at the `index` position and delete 1.
            }
        },

        // Method will be added to the Global App controller below.
        calculateBudget: function() {
            //Calculate total income and expenses. Uses the `calculateTotal method in the
            calculateTotal('exp');
            calculateTotal('inc');

            //Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //Calculate the percentage of income that we spend
            if (data.totals.inc > 0) {
                data.percentage = Math.round(
                    data.totals.exp / data.totals.inc * 100
                );
            } else {
                data.percentage = -1;
            }
        },

        //Method to caclucate percentages of item to total budget
        calculatePercentages: function() {
            // example: a = 20; b = 10; c = 40; Total = 100. What percent is each? Get an array of the expenses on the page. `forEach` loop
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc); // `calcPercentage` method is created in Expense prototype method above.
            });
        },

        //used to get the percentages. Using `map` to store the data in the variable. `forEach` does not store, it just loops. will be used in `updatePercentages` below.
        getPercentages: function() {
            let allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc; //returns an array with all of the percentages.
        },

        // Method to display the total budget in the UI
        getBudget: function() {
            //returning an object of all the totals we need. This will be used in the `displayBudget` method below.
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        //adding method so we can see the data object in the console. To use in the console `budgetController.testing()`
        testing: function() {
            console.log(data);
        }
    };
})();

///////////////////////////////////////////////
//Module 2: CREATE UI CONTROLLER. Independent
let UIController = (function() {
    //Creating an object that stores all of the DOM values. Used in all of the `document.querySelector` calls in the app. This will allow for much easier changing of the code, so that we don't need to change them manually, if the HTML/CSS change someday.
    const DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    // Method to format numbers. Adding '+' before income, '-' before expense, decimal points, comma separting values
    let formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        //Math.abs(); returns the absolute value, ignoring the '-' if it's negative.
        num = Math.abs(num);

        //Limits to 2 decimal points. Returns a string.
        num = num.toFixed(2);

        //Use `split` to add comma. Need to separate number from decimal and then add comma.
        numSplit = num.split('.'); // 2345.67 becomes an array: '2345', '67'
        int = numSplit[0];
        if (int.length > 3) {
            int =
                int.substr(0, int.length - 3) +
                ',' +
                int.substr(int.length - 3, 3); //input 2310, output 2,310. works with 150,000? But doesn't work with 1,500,000?
        }

        dec = numSplit[1];

        //Adding '+' or '-' and returning the entire new string.
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    //creating forEach hack for nodes. This is pretty complex and my brain is tired. Would be good to go back and review this portion of the lecutre: Lecture 87; about 6 minutes in.
    let nodeListForEach = function(list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    //Grab values from input fields in HTML
    //Exposes getInput to the public, so that it can be used in other controllers outside of the IIFE.
    return {
        getInput: function() {
            //Return values as an object
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Either 'inc' or 'exp', depending on what is selected
                description: document.querySelector(DOMStrings.inputDescription)
                    .value,
                value: parseFloat(
                    document.querySelector(DOMStrings.inputValue).value
                ) //`parseFloat` turns the string into a number.
            };
        },

        //Adding a new public method. `type` is either inc or exp. The `obj` is `newItem` created in the `ctrlAddItem` function below.
        addListItem: function(obj, type) {
            let html, newHTML, element;
            //Create HTML string with placeholder text.
            //Cut and paste the string from the HTML file.
            //If/else based on type
            //The HTML below has "income-%id%" and "%value%" and "%description%". I'm not entirely sure where each of these come from.
            //DOMStrings.incomeContainer (and expenseContainer) come from the DOMStrings variable in the UIController IIFE. These refer to the elements in the HTML.

            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html =
                    '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer;
                html =
                    '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with actual data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));

            //Insert the HTML into the DOM. The `element` is either `.income__list` or `.expense__list` based on the if/else statement in this addListItem function.
            document
                .querySelector(element)
                .insertAdjacentHTML('beforeend', newHTML);
        },

        //Remove deleted item from teh DOM. We need the class name to do this. `selectorID` parameter will be the `itemID` variable in `ctrlDeleteItem`.
        deleteListItem: function(selectorID) {
            //Set variable for DOM id.
            let el = document.getElementById(selectorID);

            //Removing the child. Need to go up the DOM before removing the child. Kind of strange but need to pass `el` as a parameter to `removeChild` method.
            el.parentNode.removeChild(el);
        },

        //Method to clear input fields. QuerySelectorAll returns a list.
        clearFields: function() {
            let fields, fieldsArr;
            fields = document.querySelectorAll(
                DOMStrings.inputDescription + ',' + DOMStrings.inputValue
            );

            //Since `querySelectorall returns a list, we need to use `slice` to create an array. We need to use the `call` method because `fields` is not an array, yet. To transfer into an array we need to get the prototype of the Array, which gives `Array.prototype.slice.call(fields);`. This allows us to, then, loop through the array created in the inputs and then clear them.
            fieldsArr = Array.prototype.slice.call(fields);

            //Using a forEach loop. The loop takes a callback function into the method. The callback function gives us access to the current value, the index, and the entire array. The callback function runs on each of the items in the loop. Loops over all elements in the `fieldsArr` and sets them to empty.
            fieldsArr.forEach(function(current, index, array) {
                current.value = '';
            });

            //Set focus back to "Add Description" field after entry of item.
            fieldsArr[0].focus();
        },

        //Display the budget numbers in the UI at the appropriate spots. Call this method in the Global App Controller below.
        displayBudget: function(obj) {
            let type;
            //ternary operator to add `type` variable for `formatNumber` method to display budget total with proper formatting.
            obj.budget > 0 ? (type = 'inc') : (type = 'exp');
            document.querySelector(
                DOMStrings.budgetLabel
            ).textContent = formatNumber(obj.budget, type);

            document.querySelector(
                DOMStrings.incomeLabel
            ).textContent = formatNumber(obj.totalInc, 'inc'); //from `getBudget` method above.

            document.querySelector(
                DOMStrings.expenseLabel
            ).textContent = formatNumber(obj.totalExp, 'exp'); //from `getBudget` method above.

            //display % if the % is greater than 0
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent =
                    obj.percentage + '%'; //from `getBudget` method above.
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent =
                    '---'; //from `getBudget` method above.
            }
        },

        //Displays the percentage an expense is of the whole.
        //`percentages` parameter should be
        displayPercentages: function(percentages) {
            let fields = document.querySelectorAll(
                DOMStrings.expensesPercLabel
            ); //returns a node list

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        //Method for showing current Month in UI. Will be called in the `init` method.
        displayMonth: function() {
            var now, year, month;

            now = new Date();

            months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent =
                months[month] + ' ' + year;
        },

        changedType: function() {
            let fields = document.querySelectorAll(
                DOMStrings.inputType +
                    ',' +
                    DOMStrings.inputDescription +
                    ',' +
                    DOMStrings.inputValue
            );

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputButton).classList.toggle('red');
        },

        //Exposes DOMStrings to the public, so that it can be used in other controllers outside of the IIFE.
        getDOMStrings: function() {
            return DOMStrings;
        }
    };
})();

///////////////////////////////////////////////
//Module 3: GLOBAL APP CONTROLLER. Takes parameters that allows the controller to receive data from budgetController and UIController.
let controller = (function(budgetCtrl, UICtrl) {
    //Function in which all event listeners are stored.
    let setupEventListeners = function() {
        //Variable to allow access to the DOMStrings object created above.
        let DOM = UICtrl.getDOMStrings();

        //'Add Button' Click Action. Button looks like a check mark in HTML/CSS. On click, event listener calls `ctrlAddItem` function defined below.
        document
            .querySelector(DOM.inputButton)
            .addEventListener('click', ctrlAddItem);

        //Keypress event so that the return key will function the same as the 'Add Button.' Button looks like a check mark in HTML/CSS. Parameter name can be anything. Common practice is event or e. The `event` is the event object
        document.addEventListener('keypress', function(event) {
            //If enter (keyCode 13) is pressed. event.which is used for older browsers, so good practice to include it.
            if (event.keyCode === 13 || event.which === 13) {
                //Calls the function that gets field input values and adds them to the UI.
                ctrlAddItem();
            }
        });

        //Event Listenener: Event Delegation setup for Deleting items from budget. On click, calling the `ctrlDeleteItem` function defined below. The listener is only added to the `conatiner` element of the HTML. Other events bubble up to it.
        document
            .querySelector(DOM.container)
            .addEventListener('click', ctrlDeleteItem);

        //Event Listener: change color based on selection of 'inc' or 'exp'
        document
            .querySelector(DOM.inputType)
            .addEventListener('change', UICtrl.changedType);
    };

    let updateBudget = function() {
        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        let budget = budgetCtrl.getBudget();

        //3. Display the budget on the UI. Use the `UICtrl` to call the `displayBudget` method. `budget` is the object returned from the `getBudget` method and defined in the line above this code.
        UICtrl.displayBudget(budget);
        //console.log(budget);
    };

    let updatePercentages = function() {
        //1. Calculate the percentages.
        budgetCtrl.calculatePercentages();
        //2. Read them from the budget controller.
        let percentages = budgetCtrl.getPercentages();
        //3. update the UI with new percentages.
        UICtrl.displayPercentages(percentages);
    };

    //This function is called by 'Add Button' click or  pressing 'return' in the value box in the HTML
    let ctrlAddItem = function() {
        let input, newItem;

        //1. Get field input data. Calling getInput method using the UICtrl parameter that is available in the controller function.
        input = UICtrl.getInput();
        //console.log(input);

        //Add if-else so that it is not possible to add empty description fields as income or expense. There needs to be a value.

        if (
            input.description !== '' &&
            !isNaN(input.value) &&
            input.value > 0
        ) {
            //2. Add item to budget controller. budgetCtrl is controller that allows access to budgetController function IIFE above. `input` is from the `input` variable a few lines above that grabs the HTML.
            newItem = budgetCtrl.addItem(
                input.type,
                input.description,
                input.value
            );

            //3. Add item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4. Clear the fields

            UICtrl.clearFields();

            //5. Calculate and update budget. Calling `updateBudget` from above
            updateBudget();

            //6. Calculate and update percentage of item/total budget
            updatePercentages();
        }
    };

    //`ctrlDeleteItem` is related to the event listener that points to `DOM.container` and calls this `ctrlDeleteItem` function on click of the element. Function for deleting an item. The `event` is the same parameter passed into the keyboard 'return' press. We need this because we want to know what the target element is.
    // There are multiple `parentNode` calls because we are traversing the DOM. This starts from the `<i>` element in the HTML and moves up four levels.
    let ctrlDeleteItem = function(event) {
        let itemID, splitID, type, ID;

        //`event.target` points to the event the element  which the `click` should return. In this case, it is ultimately the `id` of `<div class="item clearfix" id="income-0">`.
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            //Format of id is, something like, `inc-1`. We need to split it using `split` method. The `type` and `ID` represent parts of the variable `splitID` that we can call.

            splitID = itemID.split('-');
            type = splitID[0];
            // `ID` is a string because it comes from `itemID`, which is a string. `ID` needs to be a number, or the iff statement in `deleteItem` will not properly compare the data types.
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure. Calling `deleteItem` from up in the budgetCtrl. The `type` and `ID` parameters are the variables right above this line.
            budgetCtrl.deleteItem(type, ID);

            //2. delete the item from the UI
            UICtrl.deleteListItem(itemID);

            //3. update and show the new budget
            updateBudget();

            //4. Calculate and update percentage of item/total budget
            updatePercentages();
        }
    };

    //Making the setupEventListeners function public by creating a public initialization function.
    return {
        init: function() {
            console.log('Application has started.');
            //run the UICtrl at the start, so that displays are zeroed out. Copied the properties in the `getBudget` method and pasted here to zero out.
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });

            setupEventListeners();
        }
    };
    //I think this is where the Global App Controller [the current IIFE holding this all together] gets access to the Budget Controller and the UI Controller.
})(budgetController, UIController);

//Init function needs to be outside of function. Nothing will run without it because without it, there are no event listeners. Called 'controller.init' because it is in the controller IIFE.
//I attempted to initialize at the top of the page by pasting these lines, but it doesn't work. The controller IIFE function needs to precede this.
controller.init();
