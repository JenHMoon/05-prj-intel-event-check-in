// Get DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendance
let count = 0;
const maxCount = 50;

// Team keys
const teamKeys = ["water", "zero", "power"];

// Attendee list array for persistence
let attendeeArray = [];
// Load attendeeArray from localStorage immediately (before DOMContentLoaded)
const savedList = localStorage.getItem("attendeeList");
if (savedList) {
  attendeeArray = JSON.parse(savedList);
}

// Load counts and attendee list from localStorage
function loadCounts() {
  const savedCount = localStorage.getItem("attendeeCount");
  count = savedCount ? parseInt(savedCount) : 0;
  const attendeeCountSpan = document.getElementById("attendeeCount");
  if (attendeeCountSpan) {
    attendeeCountSpan.textContent = count;
  }
  teamKeys.forEach(function (team) {
    const savedTeamCount = localStorage.getItem(team + "Count");
    const teamCounter = document.getElementById(team + "Count");
    if (teamCounter) {
      teamCounter.textContent = savedTeamCount ? parseInt(savedTeamCount) : 0;
    }
  });
  // Progress bar
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    const percentage = Math.round((count / maxCount) * 100) + "%";
    progressBar.style.width = percentage;
  }

  // Load attendee list as array
  const attendeeList = document.getElementById("attendeeList");
  if (attendeeList) {
    attendeeList.innerHTML = "";
    attendeeArray.forEach(function (attendee) {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<span>${attendee.name}</span> <span class=\"attendee-team\">${attendee.teamName}</span>`;
      attendeeList.appendChild(listItem);
    });
  }
}

// Save counts and attendee list to localStorage
function saveCounts() {
  localStorage.setItem("attendeeCount", count);
  teamKeys.forEach(function (team) {
    const teamCounter = document.getElementById(team + "Count");
    if (teamCounter) {
      localStorage.setItem(team + "Count", teamCounter.textContent);
    }
  });
  // Save attendeeArray
  localStorage.setItem("attendeeList", JSON.stringify(attendeeArray));
}

// Load counts on page load
window.addEventListener("DOMContentLoaded", loadCounts);

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  // Increment count
  count++;
  // Update attendee count on the page
  const attendeeCountSpan = document.getElementById("attendeeCount");
  attendeeCountSpan.textContent = count;
  console.log("Total check-ins: ", count);

  // Save total count to localStorage
  saveCounts();

  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage;
  console.log(`Progress: ${percentage}`);

  // Update team count
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;
  // Save team counts to localStorage
  saveCounts();

  // Show welcome message on the page
  const message = `🎉 Welcome, ${name} from ${teamName}!`;
  const greeting = document.getElementById("greeting");
  greeting.textContent = message;
  console.log(message);

  // Add attendee to the array and list
  attendeeArray.push({ name: name, teamName: teamName });
  const attendeeList = document.getElementById("attendeeList");
  if (attendeeList) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<span>${name}</span> <span class="attendee-team">${teamName}</span>`;
    attendeeList.appendChild(listItem);
  }
  // Save all data to localStorage
  saveCounts();

  form.reset();
});
