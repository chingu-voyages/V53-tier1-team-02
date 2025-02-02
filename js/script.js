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

const mondate = document.getElementById("mondate");
const tuedate = document.getElementById("tuedate");
const weddate = document.getElementById("weddate");
const thurdate = document.getElementById("thurdate");
const fridate = document.getElementById("fridate");
const satdate = document.getElementById("satdate");
const sundate = document.getElementById("sundate");

const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const weekdayArray = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

// ***** DO WE NEED monDish or monIngredients?? *****
// const monDish = document.getElementById("mon-dish");
// const monIngredients = document.getElementById("mon-ingredients");



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

//Modal functionality
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

// 2.b) Employee allergies submit can be stored in an array or an object

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

    document.querySelectorAll('[type="checkbox"]').forEach(allergy => {
        if (allergy.checked === true) {
            allergiesObject[allergy.value] = true;
        } else if (allergy.checked === false) {
            allergiesObject[allergy.value] = false;
        }
    })

    console.log(allergiesObject);
    // FEATURE Data in object is placed into sepearte arrays
    // console.log(Object.entries(allergiesObject));
})




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

// +++++++These next chunks of code work together.+++++++
// This gets the entered date, determines the date of the 
// Monday previous to the entered date, and then sets the 
// dates of the week containing the selected date.
generateMenuBtn.addEventListener("click", () => {
    const dateAsInput = document.getElementById("calendar-entry").value;
    const dateInput = new Date(dateAsInput + 'T00:00');
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
    today.setHours(0, 0, 0, 0); //this sets the time of today's date to all 0's so that the time of day doesn't interfere with the check
    return (date >= today);
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
    const daysMonth = months[(daysDate.getMonth())]; //months uses the globally defined array to account for Jan being month 0 in the date input but we want to display as 1
    const daysDay = daysDate.getDate();
    const dayDisplay = daysMonth + "/" + daysDay;
    return dayDisplay;
}

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
}

// This function really starts the dish selection process.
// It runs once for each day of the week.
function setDishes() {
    for (let i = 0; i < 7; i++) {
        dishPicker(weekdayArray[i]);
    }
}

// This function fetches the dishes json file and passes it on to
// the next function to randomly pick a dish from those listed. ** use this in conjunction with filter allergies function
function dishPicker(weekday) {
    const getDishes = async function () {

/*************This is where we can modify these two lines to call from a different file once we have a reduced list without allergens. */        
        const res = await fetch('assets/dishes.json'); //These first two lines call the json. 
        const dishes = await res.json();
/******************************************************************************************** */

        const randomIndex = Math.floor(Math.random() * dishes.length); //these next lines select a random dish from the json
        console.log("randomIndex: " + randomIndex); //-----This will be removed for final production
        const randomDish = (dishes[randomIndex]);
        console.log(weekday + " dish: " + (randomDish.name)); //-----This will be removed for final production

        foodDisplay(weekday, randomDish);  //This calls the function to display the dishes in the calendar
    };
    getDishes();
}

// This function will take a day and dish and display it in the corresponding day of the calendar
function foodDisplay(weekday, checkedDish) {
    const checkedDishIngredients = (checkedDish.ingredients).join(", ");
    console.log((checkedDishIngredients)); //-----This will be removed for final production
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

