const scheduleBtn = document.getElementById("schedule-button");
const employeeBtn = document.getElementById("employee-button");
const closeModalBtn = document.querySelector(".close-button");
const overlay = document.getElementById("overlay");
const scheduleModalDiv = document.getElementById("schedule-modal");
const generateMenuBtn = document.getElementById("menu-btn");


// 1.) Schedule Modal Functionality 
scheduleBtn.addEventListener("click", () => {
    const modal = document.querySelector(".modal");
    openModal(modal);
})


closeModalBtn.addEventListener("click", () => {
    const modal = document.querySelector(".close-button");
    closeModal(modal)
})

overlay.addEventListener("click", () => {
    const modal = document.querySelectorAll(".modal.active");
    closeModal(modal);
})

function openModal(modal) {
    if (modal == null) return
    scheduleModalDiv.classList.add("active");
    overlay.classList.add("active");
}

function closeModal(modal) {
    if (modal == null) return
    scheduleModalDiv.classList.remove("active");
    overlay.classList.remove("active");
}


// Generate Menu Button on modal 
// generateMenuBtn.addEventListener("click", () => {
    
// })