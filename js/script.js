const scheduleBtn = document.getElementById("schedule-button");
const employeeBtn = document.getElementById("employee-button");
const closeModalBtn = document.querySelector(".close-button");
const closeModalEmployeeBtn = document.querySelector(".close-button-employee");
const overlay = document.getElementById("overlay");
const scheduleModalDiv = document.getElementById("schedule-modal");
const employeeModalDiv = document.getElementById("employee-modal");
const generateMenuBtn = document.getElementById("menu-btn");
const dishIcon = document.getElementById("dishes-icon");
const dateInput = document.getElementById("calendar-entry");

const monDish = document.getElementById("mon-dish");
const monIngredients = document.getElementById("mon-ingredients");


// 1.) Schedule Modal Functionality 
scheduleBtn.addEventListener("click", () => {
    //The lines of code between here and the openModal at the end
    //serve to auto-populate the calendar with an initial value of 
    //today's date and also set today's date as the minimum date
    //that can be entered, preventing someone from entering a date
    //in the past.
    let today = new Date();
    let dd = today.getDate();
    let mm = setMonth(today.getMonth()); //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("calendar-entry").setAttribute("min", today);
    document.getElementById("calendar-entry").setAttribute("value",today);
    openModal(scheduleModalDiv);
})


closeModalBtn.addEventListener("click", () => {
    // const modal = document.querySelector(".close-button");
    // const modal = document.querySelectorAll(".modal.active");
    const modal = document.querySelector(".modal.active");
    closeModal(modal)
})

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


// I have temporarily made the dish icon call the function to generate
// dishes to help during development.
dishIcon.addEventListener("click", () => {
    setDishes();
})

function openModal(modal) {
    if (modal == null) return
    modal.classList.add("active");
    overlay.classList.add("active");
}

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove("active");
    overlay.classList.remove("active");
}

// +++++++These next chunks of code work together.+++++++
// This gets the entered date, determines the date of the 
// Monday previous to the entered date, and then sets the 
// dates of the week containing the selected date.
generateMenuBtn.addEventListener("click", () => {
    const dateAsInput = document.getElementById("calendar-entry").value;
    const dateInput = new Date(dateAsInput + 'T00:00');
    const dayOfTheMonth = dateInput.getDate();
    const month = dateInput.getMonth();
    const displayMonth = setMonth(month);
    const mondaysDate = findMonday(dateInput);
    setCalendarDates(mondaysDate);
    setDishes();
    const modal = document.querySelector(".modal.active");
    closeModal(modal);
})

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
})

// This is the function that checks if the entered date is valid
// by making sure it's equal to or greater than today.
function isValidDate(date) {
    let today = new Date();
    today.setHours(0,0,0,0); //this sets the time of today's date to all 0's so that the time of day doesn't interfere with the check
    return (date >= today);
}


// Because the months begin with January as index 0 by default,
// this function will use the month index and return the number of
// the month for use in date displays. e.g. passing in index 2 for 
// march returns 03.
function setMonth(month) {
    const months = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
    ]
    return (months[month]);
}

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
}

// This function takes the date passed, which is a date
// of Monday for this apps purposes, and determines the
// month and date for display in the calendar. It calculates
// this by using the information from Monday's date and 
// adds the passed number of days after monday for display.
function formatCalendarDates(passedDate, daysAfterMonday) {
    const daysDate = new Date(passedDate);
    const dateDay = passedDate.getDate();
    daysDate.setDate(dateDay + (daysAfterMonday));
    const daysMonth = setMonth(daysDate.getMonth());
    const daysDay = daysDate.getDate();
    const dayDisplay = daysMonth + "/" + daysDay;
    return dayDisplay;
}

// This function takes the date passed, which was determined as 
// Monday's date earlier, and uses it to set the dates of each 
// of the calendar entries in the calendar.
function setCalendarDates(mondaysDate) {
    const mondate = document.getElementById("mondate");
    const tuedate = document.getElementById("tuedate");
    const weddate = document.getElementById("weddate");
    const thurdate = document.getElementById("thurdate");
    const fridate = document.getElementById("fridate");
    const satdate = document.getElementById("satdate");
    const sundate = document.getElementById("sundate");

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
}

// This function fetches the dishes json file and passes it on to
// the next function to randomly pick a dish from those listed. ** use this in conjunction with filter allergies function
function dishPicker(weekday) {
    console.log("entered dish picker function");
    const getDishes = async function () {
        const res = await fetch('assets/dishes.json');
        const dishes = await res.json();
        console.log(dishes);
        console.log("dishes");
        selectRandomDish(dishes, weekday);
    };
    getDishes();
}

// This function randomly selects a dish from those in the
// passed json file.
function selectRandomDish(dishes, weekday) {
    const randomIndex = Math.floor(Math.random() * dishes.length);
    console.log("randomIndex: " + randomIndex);
    const randomDish = (dishes[randomIndex]);
    console.log(weekday + " dish: " + (randomDish.name));
    allergyCheck(randomDish);
}

function foodDisplay(checkedDish) {
    const checkedDishIngredients = (checkedDish.ingredients).join(", ");
    console.log((checkedDishIngredients));
    monDish.textContent = (checkedDish.name);
    monIngredients.textContent = ("Ingredients: " + checkedDishIngredients);
    let dishIngredients = checkedDish.ingredients;
    console.table(dishIngredients);
}

// This function really just calls the next to start the dish selection process.
// It may be removed for effeciency when we're all done or it may be modified and
// used to select different days of the week...
function setDishes() {
    dishPicker("monday");
}

function allergyCheck(randomDish) {
    foodDisplay(randomDish);
};

//  JSON MENU CODE

// 1.) Use JSON and filter allergens function to create an allergy free array []

// 2.) Generate random dish from allergy free array [pizza, pasta]

// 3.) Render random dishes to front screen


// function allergyCheck(randomDish){
//     if(Tree Nuts) {
//         //    does randomDish.ingredients contain wheat||bread||
//         // if the dish fails this check, call selectRandomDish()
//         //  again to get a new dish
//         }
//     if(Garlic) {
//         // check for Garlic ingredients
//     }
//     if(Milk) {
//         // check for Milk ingredients
//     }
//     if(Gluten) {
//         // check for Gluten ingredients
//     }
//     if(Corn) {
//         // check for Corn ingredients
//     }
//     if(Chocolate) {
//         // check for Chocolate ingredients
//     }
// }

// Get required info 

