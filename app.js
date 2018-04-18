///////////////////////////////////////////////
//Module 1: BUDGET CONTROLLER. Create IIFE to keep data safe. Independent.
let budgetController = (function() {
    //creating a constructor for expenses. this.id = id; means that the value passed in as the id parameter is the this.id.
    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    //creating an object to hold all of the income and expenses. It has two objects wihtin an object: allItems and totals within data.
    let data = {
        allItems: {
            expenses: [],
            income: []
        },

        totals: {
            expenses: 0,
            income: 0
        }
    };
})();

///////////////////////////////////////////////
//Module 2: CREATE UI CONTROLLER. Independent
let UIController = (function() {
    //Creating an object that stores all of the DOM values. Used in all of the document.querySelectorThis will allow for much easier changing of the code, so that we don't need to change them manually, if the HTML/CSS change someday.
    const DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
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
                value: document.querySelector(DOMStrings.inputValue).value
            };
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
        //'Add Button' Click Action. Button looks like a check mark in HTML/CSS.
        document
            .querySelector(DOM.inputButton)
            .addEventListener('click', ctrlAddItem);
        //Keypress event so that the return key will function the same as the 'Add Button.' Button looks like a check mark in HTML/CSS. Parameter name can be anything. Common practice is event or e.
        document.addEventListener('keypress', function(event) {
            //If enter (keyCode 13) is pressed. event.which is used for older browsers, so good practice to include it.
            if (event.keyCode === 13 || event.which === 13) {
                //Calls the function that gets field input values and adds them to the UI.
                ctrlAddItem();
            }
        });
    };

    //This function is called by 'Add Button' click or a pressing 'return' in the value box in the HTML
    let ctrlAddItem = function() {
        //1. Get field input data. Calling getInput method using the UICtrl parameter that is available in the controller function.
        let input = UICtrl.getInput();
        console.log(input);

        //2. Add item to budget controller
        //3. Add item to the UI
        //4. Calculate the budget
        //5. Display the budget on the UI
    };

    //Making the setupEventListeners function public by creating a public initialization function.
    return {
        init: function() {
            setupEventListeners();
        }
    };
})(budgetController, UIController);

//Init function needs to be outside of function. Nothing will run without it because without it, there are not event listeners. Called 'controller.init' because it is in the controller IIFE.
//I attempted to initialize at the top of the page by pasting these lines, but it doesn't work. The controller IIFE function needs to precede this.
controller.init();
