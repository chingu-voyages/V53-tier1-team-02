const scheduleBtn = document.getElementById("schedule-button");
const employeeBtn = document.getElementById("employee-button");
const closeModalBtn = document.querySelector(".close-button");
const closeModalEmployeeBtn = document.querySelector(".close-button-employee");
const overlay = document.getElementById("overlay");
const scheduleModalDiv = document.getElementById("schedule-modal");
const employeeModalDiv = document.getElementById("employee-modal");
const form = document.querySelector("form")
const generateMenuBtn = document.getElementById("menu-btn");
const dishIcon = document.getElementById("dishes-icon");
const dateInput = document.getElementById("calendar-entry");
let allergiesArray = [];
let allergiesObject = {};
let allergenicIngredients = [];
let dishes = [];
let dishesObj;
const mondate = document.getElementById("mondate");
const tuedate = document.getElementById("tuedate");
const weddate = document.getElementById("weddate");
const thurdate = document.getElementById("thurdate");
const fridate = document.getElementById("fridate");
const satdate = document.getElementById("satdate");
const sundate = document.getElementById("sundate");

const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const weekdayArray = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]


// This line runs once when the page loads and runs the function "loadDishes"
document.querySelector("body").onload = function () { loadDishes() };

// This function calls the pre-saved json file so that the info is available in the form of an array for use
// in later functions.
function loadDishes() {
    const getDishes = async function () {
        const res = await fetch('assets/dishes.json'); //These two lines call the json. 
        dishes = await res.json();
        console.log(dishes);
    }
    getDishes();
    
}


// 1.) Schedule Modal Functionality 
scheduleBtn.addEventListener("click", () => {
    //The lines of code between here and the openModal at the end
    //serve to auto-populate the calendar with an initial value of 
    //today's date and also set today's date as the minimum date
    //that can be entered, preventing someone from entering a date
    //in the past.
    let today = new Date();
    let dd = today.getDate();
    let mm = months[(today.getMonth())];
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("calendar-entry").setAttribute("min", today);
    document.getElementById("calendar-entry").setAttribute("value", today);
    openModal(scheduleModalDiv);
})

//Modal functionality, enables the modal to open and close by click on the "x" button as well as clicking outside of the modal itself, other buttons outside of the modal are unable to be interacted with, there is also a background dull feature
closeModalBtn.addEventListener("click", () => {
    // const modal = document.querySelector(".close-button");
    // const modal = document.querySelectorAll(".modal.active");
    const modal = document.querySelector(".modal.active");
    closeModal(modal)
})

//Adds background change feature
overlay.addEventListener("click", () => {
    // const modal = document.querySelectorAll(".modal.active");
    const modal = document.querySelector(".modal.active");
    closeModal(modal);
})

// 2.) Employee Modal Functionality
employeeBtn.addEventListener("click", () => {
    openModal(employeeModalDiv);
})

closeModalEmployeeBtn.addEventListener("click", () => {
    const modal = document.querySelector(".modal.active");
    closeModal(modal)
})

// 2.b) Employee allergies submission, can be stored in an array or an object

// 2.b1) Store allergies in an array (Secondary Pick)
// form.addEventListener("submit", (e) => {
//     e.preventDefault();

//     document.querySelectorAll('[type="checkbox"]').forEach(allergy => {
//         if (allergy.checked === true) {
//             allergiesArray.push(allergy.value);
//         }
//     })

//     console.log(allergiesArray);
// })

// 2.b2) Store allergies in an object (TOP PICK*)
form.addEventListener("submit", (e) => {
    e.preventDefault();
    allergiesRegistered();
    // allergyCheck();
    // document.querySelectorAll('[type="checkbox"]').forEach(allergy => {
    //     if (allergy.checked === true) {
    //         allergiesObject[allergy.value] = true;
    //     } else if (allergy.checked === false) {
    //         allergiesObject[allergy.value] = false;
    //     }
    // })

    // console.log(allergiesObject);
    
})

//STEPS 1.) Convert object to arrays 2.) arrays to one single arrays with keys 3.) use that for the if

// Function that stores allergies in an object
function allergiesRegistered() {
    document.querySelectorAll('[type="checkbox"]').forEach(allergy => {
        if (allergy.checked === true) {
            allergiesObject[allergy.value] = true;
        } else if (allergy.checked === false) {
            allergiesObject[allergy.value] = false;
        }
    })
    console.log(allergiesObject);
    console.log(allergiesObject.Garlic);
    allergyCheck();
    // FEATURE Data in object is placed into sepearte arrays
    // console.log(Object.entries(allergiesObject));
}

// edit UPDATED FLAGGED FOODS 
function allergyCheck(){
    // if(Tree Nuts === true) {
    //      // No tree nuts
    //     }
    if(allergiesObject.Garlic === true) {
        allergenicIngredients.push("Garlic");
    }
    if(allergiesObject.Milk === true) {
        allergenicIngredients.push("Cream", "Cheese", "butter", "yogurt")
    }
    if(allergiesObject.Gluten === true) {
        allergenicIngredients.push("Bread", "Flour", "Pasta")
    }
    if(allergiesObject.Corn === true) {
        allergenicIngredients.push("Corn")
    }
    if(allergiesObject.Chocolate === true) {
        allergenicIngredients.push("Chocolate")
    }
     console.log(allergenicIngredients); 
}



// I have temporarily made the dish icon call the function to generate
// dishes to help during development.
dishIcon.addEventListener("click", () => {
    setDishes();
})

// Opens modal
function openModal(modal) {
    if (modal == null) return
    modal.classList.add("active");
    overlay.classList.add("active");
}

// Closes modal 
function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove("active");
    overlay.classList.remove("active");
}


// +++++++These next five chunks of code work together to set the calendar dates.+++++++

// This disables the "Generate Menu" button if the entered
// date is not valid and changes the text of the button to let
// the user know they have to enter a valid date of today or 
// in the future.
dateInput.addEventListener("input", () => {
    const enteredDate = new Date(dateInput.value + 'T00:00');
    if (isValidDate(enteredDate)) {
        generateMenuBtn.disabled = false;
        generateMenuBtn.style.fontSize = "18px";
        generateMenuBtn.textContent = "Generate Menu";
    } else {
        generateMenuBtn.disabled = true;
        generateMenuBtn.style.fontSize = ".75em";
        generateMenuBtn.textContent = "Enter valid current or future date";
    }
});

// This is the function that checks if the entered date is valid
// by making sure it's equal to or greater than today.
function isValidDate(date) {
    let today = new Date();
    today.setHours(0, 0, 0, 0); //this sets the time of today's date to all 0's so that the time of day doesn't interfere with the check
    return (date >= today);
};

// This gets the entered date and:
// 1) determines the date of the Monday previous to the entered date
// 2) Sets the dates of the week following that Monday, which will include the day selected on the calendar.
// 3) Calls the function that starts the process of selecting dishes for the calendar
// 4) Closes the modal
generateMenuBtn.addEventListener("click", () => {
    const dateAsInput = document.getElementById("calendar-entry").value;
    const dateInput = new Date(dateAsInput + 'T00:00');
    const mondaysDate = findMonday(dateInput);
    setCalendarDates(mondaysDate);
    setDishes();
    const modal = document.querySelector(".modal.active");
    closeModal(modal);
});

// This function will take the date that is passed to it and find the 
// date of the Monday of that dates's week. This is assuming the week
// desired starts on Monday and ends on Sunday.
function findMonday(passedDate) {
    let dayOfTheWeek = passedDate.getDay();
    if (dayOfTheWeek == 0) dayOfTheWeek += 7;
    const mondaysDate = new Date(passedDate);
    const dateDay = passedDate.getDate();
    mondaysDate.setDate(dateDay - (dayOfTheWeek - 1));
    return mondaysDate;
};

// This function takes the date passed, which was determined as 
// Monday's date earlier, and uses it to set the dates of each 
// of the calendar entries in the calendar.
function setCalendarDates(mondaysDate) {
    const monDay = formatCalendarDates(mondaysDate, 0);
    mondate.textContent = monDay;
    const tueDay = formatCalendarDates(mondaysDate, 1);
    tuedate.textContent = tueDay;
    const wedDay = formatCalendarDates(mondaysDate, 2);
    weddate.textContent = wedDay;
    const thurDay = formatCalendarDates(mondaysDate, 3);
    thurdate.textContent = thurDay;
    const friDay = formatCalendarDates(mondaysDate, 4);
    fridate.textContent = friDay;
    const satDay = formatCalendarDates(mondaysDate, 5);
    satdate.textContent = satDay;
    const sunDay = formatCalendarDates(mondaysDate, 6);
    sundate.textContent = sunDay;
};

// This function takes the date passed, which is a date
// of Monday for this apps purposes, and determines the
// month and date for display in the calendar. It calculates
// this by using the information from Monday's date and 
// adds the passed number of days after monday for display.
function formatCalendarDates(mondaysDate, daysAfterMonday) {
    const daysDate = new Date(mondaysDate); //This line puts the date that was passed into a standard format string that js can use
    const dateDay = mondaysDate.getDate(); //This is the line that gets the number of the day from the date
    daysDate.setDate(dateDay + (daysAfterMonday)); //This is the line that adds to the date based on the day of the week and how many days after Monday it is
    const daysMonth = months[(daysDate.getMonth())]; //months uses the globally defined array to account for Jan being month 0 in the date input but we want to display as 1
    const daysDay = daysDate.getDate();
    const dayDisplay = daysMonth + "/" + daysDay;
    return dayDisplay;
};



// This function starts the dish selection process.
// It runs once for each day of the week.
function setDishes() {
    let weekdayDishArray = [];
    for (let i = 0; i < 7; i++) {
        getDailyDish(weekdayArray[i], weekdayDishArray);
    }
    let weekdayDishArrayNames = weekdayDishArray.map(weekdayDishArray => weekdayDishArray.name); //This line creates an array of just the dish names
    // console.log(`The week's dishes: ${weekdayDishArrayNames}`); //This may be removed for final production. The array of dish names is useful in development but may not serve a purpose when all is complete.
    console.log(`The week's dishes: `);
    console.table(weekdayDishArray); //This may be removed for final production. The array of dish names is useful in development but may not serve a purpose when all is complete.
};


// Creating ingredient array

        // to protect the original dishes array, dishesObj is created
        dishesObj = dishes
        console.log(typeof dishesObj); // Identifying dishes as object
        console.log(dishesObj); // Displaying object

        // DESTRUCTURING PRACTICE
        // let [ {ingredients: items}, {ingredients: items1} ] = dishesObj
        // // items1 ...items50
        // // loop for add all items in an array 
        // // filtering for all unique items in that array
        // // const {ingredients} = dishes; 
        // console.log(items, items1);
        
        // .map is used to pick out all ingredients from each object within the array
        // .flat() takes all the arrays (50) and compresses them into one COOL feature
        // (223 total ingredients)
        const ingredients = dishesObj.map(dish => dish.ingredients).flat()
        console.log(ingredients);


        //loop is used to create a uniqueIngredients array 
        // (47 unique ingredients)
        let uniqueIngredients = []
        for (let i = 0; i < ingredients.length; i++) {
            if (!uniqueIngredients.includes(ingredients[i])) {
                uniqueIngredients.push(ingredients[i]);
            }
        }

        console.log(uniqueIngredients);

        // LOOP DESTRUCRING PRACTICE 
        // for (let i = 0; i < dishesObj.length + 1; i++) {
        //     const ingredientsArray = [];
        //     // let [ {ingredients: items} ] = dishesObj; 
        //     // ingredientsArray.push(items);
        //     ingredientsArray.push(i);
        //     console.log(ingredientsArray);
        // }





/////////////////////////////////////////////////////////////////////////////////////////////////

// This function randomly picks a dish from the dish array 
/*   ** Once we have a different array that has removed allergen-containing ingredients, we can
   replace dishes with the new array and it should work the same. */
function getDailyDish(weekday, weekdayDishArray) {
    getRandomDish(weekday)
    function getRandomDish(weekday) {
        const randomIndex = Math.floor(Math.random() * dishes.length); //these next lines select a random dish from the dishes array
        const randomDish = (dishes[randomIndex]);
        console.log(weekday + " dish: " + (randomDish.name)); //-----This will be removed for final production
        repetitionCheck(randomDish);
    };
    function repetitionCheck(randomDish) {
        /* The .some() function is used to check if the passed dish's name is already contained in the array of already-selected dishes */
        if (weekdayDishArray.some(weekdayDishArray => weekdayDishArray.name == randomDish.name)) {
            console.warn(randomDish.name + " is already used. Selecting another.");
            getRandomDish(weekday); //If the dish that was randomly selected has the same name as a dish already previously selected for the week, this line will re-start the selection to randomly select another.
        } else {
            weekdayDishArray.push(randomDish); //This line will add the randomly selected dish to an array of dishes that have been selected for the week.
            console.log(randomDish.name + " was added to the week's dishes."); /* Can be removed for final production */
            foodDisplay(weekday, randomDish);  //This calls the function to display the dishes in the calendar
        };
    };
};

// This function will take a day and dish and display it in the corresponding day of the calendar
function foodDisplay(weekday, checkedDish) {
    const checkedDishIngredients = (checkedDish.ingredients).join(", ");
    // console.log((checkedDishIngredients)); //-----This will be removed for final production
    let dayDish = document.querySelector(`#${weekday} .dish-name`);
    let dayIngredients = document.querySelector(`#${weekday} .ingredients`);
    dayDish.textContent = (checkedDish.name);
    dayIngredients.textContent = ("Ingredients: " + checkedDishIngredients);
}

// function allergyCheck(randomDish) {
//     foodDisplay(randomDish);
// };

//  JSON MENU CODE

// 1.) Use JSON and filter allergens function to create an allergy free array [] 

// 2.) Generate random dish from allergy free array [pizza, pasta] 

// 3.) Render random dishes to front screen

//original notes
// function allergyCheck(randomDish){
//     if(Tree Nuts === true) {
//         //    does randomDish.ingredients contain wheat||bread||
//         // if the dish fails this check, call selectRandomDish()
//         //  again to get a new dish
//         }
//     if(Garlic === true) {
//         // check for Garlic ingredients
//     }
//     if(Milk === true) {
//         // check for Milk ingredients
//     }
//     if(Gluten === true) {
//         // check for Gluten ingredients
//     }
//     if(Corn === true) {
//         // check for Corn ingredients
//     }
//     if(Chocolate === true) {
//         // check for Chocolate ingredients
//     }
// }






// Get required info 


// Allergenic ingredients array i.e specific gluten based products such as bread, wheat, flour

// filter for the dishes array correseponding to allergens

// test push

// page load event listener
// function uniqueIngredients() {
// const res = await fetch('assets/dishes.json'); //These first two lines call the json. 
// dishes = await res.json();
// console.log(dishes);

// }