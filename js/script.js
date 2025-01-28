const scheduleBtn = document.getElementById("schedule-button");
const employeeBtn = document.getElementById("employee-button");
const closeModalBtn = document.querySelector(".close-button");
const overlay = document.getElementById("overlay");
const scheduleModalDiv = document.getElementById("schedule-modal");
const employeeModalDiv = document.getElementById("employee-modal");
const generateMenuBtn = document.getElementById("menu-btn");
const dishIcon = document.getElementById("dishes-icon");

const monDish = document.getElementById("mon-dish");
const monIngredients = document.getElementById("mon-ingredients");


// 1.) Schedule Modal Functionality 
scheduleBtn.addEventListener("click", () => {
    // const modal = document.querySelector(".modal");
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

closeModalBtn.addEventListener("click", () => {
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

generateMenuBtn.addEventListener("click", () => {
    const dateAsInput = document.getElementById("calendar-entry").value;
    // console.log("Date as input: " + dateAsInput);

    const dateInput = new Date(dateAsInput + 'T00:00');
    // console.log("Converted to local time: " + dateInput);

    const dayOfTheMonth = dateInput.getDate();

    const month = dateInput.getMonth();
    const displayMonth = setMonth(month);
    const mondaysDate = findMonday(dateInput);
    console.log("Monday's date: " + mondaysDate);
    setCalendarDates(mondaysDate);
    setDishes();
    const modal = document.querySelector(".modal.active");
    closeModal(modal);
})

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
 function selectRandomDish (dishes, weekday) {
    const randomIndex = Math.floor(Math.random() * dishes.length);
    console.log("randomIndex: " + randomIndex);
    const randomDish = (dishes[randomIndex]);
    console.log(weekday + " dish: " +(randomDish.name));
    const randomDishIngredients = (randomDish.ingredients).join(", ");
    console.log((randomDishIngredients));
    monDish.textContent = (randomDish.name);
    monIngredients.textContent = ("Ingredients: "+randomDishIngredients);
    let dishIngredients = randomDish.ingredients;
    console.log(dishIngredients);
}

// This function really just calls the next to start the dish selection process.
// It may be removed for effeciency when we're all done.
function setDishes() {
    dishPicker("monday");
}

//  JSON MENU CODE 

// 1.) Use JSON and filter allergens function to create an allergy free array []

// 2.) Generate random dish from allergy free array [pizza, pasta]

// 3.) Render random dishes to front screen