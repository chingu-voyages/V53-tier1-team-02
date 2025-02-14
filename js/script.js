const scheduleBtn = document.getElementById("schedule-button");
const employeeBtn = document.getElementById("employee-button");
const closeModalBtn = document.querySelector(".close-button");
const closeModalEmployeeBtn = document.querySelector(".close-button-employee");
const overlay = document.getElementById("overlay");
const scheduleModalDiv = document.getElementById("schedule-modal");
const employeeModalDiv = document.getElementById("employee-modal");
const formEmployee = document.getElementById("form-employee");
const formSchedule = document.getElementById("form-schedule");
const generateMenuBtn = document.getElementById("menu-btn");
const allergiesButton = document.getElementById("allergies-btn");
const dishIcon = document.getElementById("dishes-icon");
const dateInput = document.getElementById("calendar-entry");
let allergiesArray = [];
let allergiesObject = { Treenuts: false, Garlic: false, Milk: false, Gluten: false, Corn: false, Chocolate: false };
let daysOffObject = { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false, Sunday: false };
let allergenicIngredients = [];
let dishes = [];
let daysOffObj = {};
let dishesObj;
let dishesScreened;
let allergenScreenedDishes = [];
const mondate = document.getElementById("mondate");
const tuedate = document.getElementById("tuedate");
const weddate = document.getElementById("weddate");
const thurdate = document.getElementById("thurdate");
const fridate = document.getElementById("fridate");
const satdate = document.getElementById("satdate");
const sundate = document.getElementById("sundate");
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const weekdayArray = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

// This line runs once when the page loads and runs the function "loadDishes"
document.querySelector("body").onload = function () {
    loadDishes();
};


// This function calls the pre-saved json file so that the info is available in the form of an array for use
// in later functions.
function loadDishes() {
    const getDishes = async function () {
        const res = await fetch('assets/dishes.json'); //These two lines call the json. 
        dishes = await res.json();

        // to protect the original dishes array, dishesObj is created
        dishesObj = dishes;

        // .map is used to pick out all ingredients from each object within the array
        // .flat() takes all the arrays (50) and compresses them into one, COOL feature
        // (223 total ingredients)
        const ingredients = dishesObj.map(dish => dish.ingredients).flat();
        // console.log(ingredients);


        //loop is used to create a uniqueIngredients array 
        // (47 unique ingredients)
        let uniqueIngredients = [];
        for (let i = 0; i < ingredients.length; i++) {
            if (!uniqueIngredients.includes(ingredients[i])) {
                uniqueIngredients.push(ingredients[i]);
            }
        }
    }
    getDishes();
}


// 1.) Schedule Modal Functionality 
scheduleBtn.addEventListener("click", () => {
    setCheckBoxesSchedule();
    openModal(scheduleModalDiv);
    initCalendar();
    //The lines of code between here and the openModal at the end
    //serve to auto-populate the calendar with an initial value of 
    //today's date and also set today's date as the minimum date
    //that can be entered, preventing someone from entering a date
})

function initCalendar() {
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
};

//Modal functionality, enables the modal to open and close by click on the "x" button as well as clicking outside of the modal itself, other buttons outside of the modal are unable to be interacted with, there is also a background dull feature
closeModalBtn.addEventListener("click", () => {
    const modal = document.querySelector(".modal.active");
    closeModal(modal);
});

//Adds background change feature
overlay.addEventListener("click", () => {
    const modal = document.querySelector(".modal.active");
    closeModal(modal);
});

// 2.) Employee Modal Functionality
employeeBtn.addEventListener("click", () => {
    openModal(employeeModalDiv);
    setCheckBoxesEmployee();
});

closeModalEmployeeBtn.addEventListener("click", () => {
    const modal = document.querySelector(".modal.active");
    closeModal(modal);
});

function setCheckBoxesEmployee() {
    console.log("allergiesObject:");
    console.log(allergiesObject);
    document.getElementById("tree-nuts").checked = (allergiesObject.Treenuts);
    document.getElementById("garlic").checked = (allergiesObject.Garlic);
    document.getElementById("milk").checked = (allergiesObject.Milk);
    document.getElementById("gluten").checked = (allergiesObject.Gluten);
    document.getElementById("corn").checked = (allergiesObject.Corn);
    document.getElementById("chocolate").checked = (allergiesObject.Chocolate);
};

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        // Do something when the checkbox state changes
        console.log("checkbox change");
    });
});

// 2.b2) Store allergies in an object (TOP PICK*)
formEmployee.addEventListener("submit", (e) => {
    e.preventDefault();
    allergiesRegistered();
    const modal = document.querySelector(".modal.active");
    closeModal(modal);
    schedNotClicked();
});

// add date Testing 
function schedNotClicked() {
    if (mondate.innerText === "mm/dd") {
        defaultCurrentDate();
    }
};


// Function that stores allergies in an object
function allergiesRegistered() {
    document.querySelectorAll('[class="allergy-checkbox"]').forEach(allergy => {
        if (allergy.checked) {
            allergiesObject[allergy.value] = true;
        } else if (!allergy.checked) {
            allergiesObject[allergy.value] = false;
        };
    });
    console.log(allergiesObject);
    allergyCheck();
    // FEATURE Data in object is placed into sepearte arrays
};

// Creates an array of days with true if they are marked as a day off
function daysOffRegistered() {
    document.querySelectorAll('[class="days-off"]').forEach(day => {
        if (day.checked) {
            daysOffObject[day.value] = true;
        } else if (!day.checked) {
            daysOffObject[day.value] = false;
        };
    });
    displayDaysOff();
};

// Show a day off message instead of a dish if the day is marked as a day off
function displayDaysOff() {
    for (let day in daysOffObject) {
        let dayLowerCase = day.toLowerCase();
        let foodArea = document.querySelector(`[id=${dayLowerCase}] .food-area`);
        let caloriesArea = document.querySelector(`[id=${dayLowerCase}] .calories-area`);
        let specialMessage = document.querySelector(`[id=${dayLowerCase}] .special-message`);

        if (daysOffObject[day]) {
            foodArea.classList.add("hidden");
            caloriesArea.classList.add("hidden");
            specialMessage.textContent = "Day Off!";
            specialMessage.classList.remove("hidden");
        } else {
            foodArea.classList.remove("hidden");
            caloriesArea.classList.remove("hidden");
            specialMessage.classList.add("hidden");
        };
    };    
};

// edit UPDATED FLAGGED FOODS 
function allergyCheck() {
    allergenicIngredients = [];
    if (allergiesObject.Treenuts === true) {
        // No tree nuts
    }
    if (allergiesObject.Garlic === true) {
        allergenicIngredients.push("Garlic");
    }
    if (allergiesObject.Milk === true) {
        allergenicIngredients.push("Milk", "Cream", "Cheese", "Butter", "Yogurt")
    }
    if (allergiesObject.Gluten === true) {
        allergenicIngredients.push("Bread", "Flour", "Pasta")
    }
    if (allergiesObject.Corn === true) {
        allergenicIngredients.push("Corn")
    }
    if (allergiesObject.Chocolate === true) {
        allergenicIngredients.push("Chocolate")
    }
    removeAllergens();
};


function removeAllergens() {
    allergenScreenedDishes = [];
    function containsAny(arr1, arr2) {
        return arr1.some(item => arr2.includes(item));
    }
    for (let i = 0; i < dishes.length; i++) {
        let testIngredients = dishes[i].ingredients;
        if (containsAny(testIngredients, allergenicIngredients)) {
        } else {
            allergenScreenedDishes.push(dishes[i]);
        }
    }
    setDishes();
};

// There was dish icon that was made to call the function to generate
// dishes to help during development. In the interest of future features, it was 
// commented out rather than deleted. This is the code for it if desired to re-use again.
// dishIcon.addEventListener("click", () => {
//     removeAllergens();
// });

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
    defaultCurrentDate();
});

// 
function defaultCurrentDate() {
    initCalendar();
    const dateAsInput = document.getElementById("calendar-entry").value;
    const dateInput = new Date(dateAsInput + 'T00:00');
    const mondaysDate = findMonday(dateInput);
    setCalendarDates(mondaysDate);
    removeAllergens();
    const modal = document.querySelector(".modal.active");
    // daysOffRegistered(); // NEW CODE **
    closeModal(modal);
}

// Days off stored 
formSchedule.addEventListener("submit", (e) => {
    e.preventDefault();
    daysOffRegistered();
    const modal = document.querySelector(".modal.active");
    closeModal(modal);
});

function setCheckBoxesSchedule() {
    document.getElementById("monday-off").checked = (daysOffObject.Monday);
    document.getElementById("tuesday-off").checked = (daysOffObject.Tuesday);
    document.getElementById("wednesday-off").checked = (daysOffObject.Wednesday);
    document.getElementById("thursday-off").checked = (daysOffObject.Thursday);
    document.getElementById("friday-off").checked = (daysOffObject.Friday);
    document.getElementById("saturday-off").checked = (daysOffObject.Saturday);
    document.getElementById("sunday-off").checked = (daysOffObject.Sunday);
};

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
    console.table(weekdayDishArray); //This can be removed if desired for final production. The array of dish names is useful in development but may not serve a purpose when all is complete.
};



// This function randomly picks a dish from the dish array 
/*   ** Once we have a different array that has removed allergen-containing ingredients, we can
   replace dishes with the new array and it should work the same. */
function getDailyDish(weekday, weekdayDishArray) {
    getRandomDish(weekday)
    function getRandomDish(weekday) {
        const randomIndex = Math.floor(Math.random() * allergenScreenedDishes.length); //these next lines select a random dish from the dishes array
        const randomDish = (allergenScreenedDishes[randomIndex]);
        repetitionCheck(randomDish);
    };
    function repetitionCheck(randomDish) {
        /* The .some() function is used to check if the passed dish's name is already contained in the array of already-selected dishes */
        if (weekdayDishArray.some(weekdayDishArray => weekdayDishArray.name == randomDish.name)) {
            // console.warn(randomDish.name + " is already used. Selecting another.");
            getRandomDish(weekday); //If the dish that was randomly selected has the same name as a dish already previously selected for the week, this line will re-start the selection to randomly select another.
        } else {
            weekdayDishArray.push(randomDish); //This line will add the randomly selected dish to an array of allergen screened dishes that have been selected for the week.
            // console.log(randomDish.name + " was added to the week's dishes."); /* Can be removed for final production */
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
    let dayCalories = document.querySelector(`#${weekday} .calories-number`);
    dayDish.textContent = (checkedDish.name);
    dayIngredients.textContent = ("Ingredients: " + checkedDishIngredients);
    dayCalories.textContent = (`${checkedDish.calories} cal`);
}






