async function setSnooze() {
  //let username = document.getElementById("usernameInput").value;
  //let password = document.getElementById("passwordInput").value;
  const snoozeMinutesOut = document.getElementById("snoozeMinutesOut").value;
  const snoozeMinutes = parseInt(snoozeMinutesOut.match(/\d+/)[0], 10);

  //console.log("Username:", username);
  //console.log("Password:", password);

  const url = "https://rdx-04-dev-pivs.rdxpims.local/piwebapi";
  //const token = btoa(username + ":" + password);
  const headers = new Headers();
  //headers.append("Authorization", "Basic " + token);
  headers.append("Content-Type", "application/json");
  //headers.append("X-Requested-With", "");
  const params = new URLSearchParams(window.location.search);
  //console.log("params", params);

  let now = new Date();
  let snoozeUntil = new Date(now.getTime() + snoozeMinutes * 60 * 1000);

  const content = {
    getSnoozeWebID: {
      Method: "GET",
      Resource: url + "/attributes?" + params + "|Snooze",
    },
    postSnoozeValue: {
      Method: "POST",
      ParentIDs: ["getSnoozeWebID"],
      Content: "{ Value: true }",
      RequestTemplate: {
        Resource: url + "/streams/{0}/value",
      },
      Parameters: ["$.getSnoozeWebID.Content.WebId"],
    },
    getSnoozeUntilWebID: {
      Method: "GET",
      Resource: url + "/attributes?" + params + "|Snooze|SnoozeUntil",
    },
    postSnoozeUntilValue: {
      Method: "POST",
      ParentIDs: ["getSnoozeUntilWebID"],
      Content: `{ Value: '${snoozeUntil.toISOString()}' }`,
      RequestTemplate: {
        Resource: url + "/streams/{0}/value",
      },
      Parameters: ["$.getSnoozeUntilWebID.Content.WebId"],
    },
  };

  const parsedContent = JSON.stringify(content);
  //console.log(parsedContent);

  fetch(url + "/batch", {
    method: "POST",
    headers: headers,
    body: parsedContent,
    mode: "cors",
    credentials: "same-origin",
  })
    .then((response) => {
      if (response.ok) {
        //console.log("OK", response);
        alert("Snooze set with success!");
      }
    })
    .catch((error) => alert(error));
}
