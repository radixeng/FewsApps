function checkSnoozeValue() {
  const snoozeMinutesOut = document.getElementById("snoozeMinutesOut").value;

  let snoozeButton = document.getElementById("snoozeButton");

  if (snoozeMinutesOut) snoozeButton.disabled = false;
  else snoozeButton.disabled = true;
}

checkSnoozeValue(); // Call the function initially to set the button state
