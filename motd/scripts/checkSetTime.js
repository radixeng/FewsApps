function checkSetTime() {
  const setTimeOut = document.getElementById("setTimeOut").value;

  let setTimeButton = document.getElementById("setTimeButton");

  if (setTimeOut) setTimeButton.disabled = false;
  else setTimeButton.disabled = true;
}

checkSetTime(); // Call the function initially to set the button state
