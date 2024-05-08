async function setSnooze() {
  const snoozeMinutesOut = document.getElementById("snoozeMinutesOut").value;
  const snoozeMinutes = parseInt(snoozeMinutesOut.match(/\d+/)[0], 10);

  const currentUrl = window.location.host;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  //headers.append("X-Requested-With", "");

  const now = new Date();
  const elementPath = getUrlPath();
  const content = bodyBuilder(currentUrl, elementPath, now, snoozeMinutes);
  const parsedContent = JSON.stringify(content);
  //console.log(parsedContent);

  fetch("https://" + currentUrl + "/piwebapi/batch", {
    method: "POST",
    headers: headers,
    body: parsedContent,
    credentials: "same-origin",
  })
    .then((response) => {
      if (response.ok) {
        //console.log("OK", response);
        alert("Snooze set with success!");
      } else {
        throw new Error("Network response failed ", response.json());
      }
    })
    .catch((error) => alert(error));

  function getUrlPath() {
    const params = new URLSearchParams(window.location.search);
    const path = params.get("path");

    return path;
  }
  function bodyBuilder(serverName, elementPath, now, duration) {
    return {
      GET_Snooze_WebId: {
        Method: "GET",
        Resource:
          "https://" +
          serverName +
          "/piwebapi/attributes?path=" +
          elementPath +
          "|Snooze",
      },
      POST_Snooze_value: {
        Method: "POST",
        ParentIDs: ["GET_Snooze_WebId"],
        Content: '{"Value":"True", "Timestamp": "' + now.toISOString() + '",}',
        RequestTemplate: {
          Resource: "https://" + serverName + "/piwebapi/streams/{0}/value",
        },
        Parameters: ["$.GET_Snooze_WebId.Content.WebId"],
      },
      GET_Duration_WebId: {
        Method: "GET",
        Resource:
          "https://" +
          serverName +
          "/piwebapi/attributes?path=" +
          elementPath +
          "|Snooze|Duration",
      },
      POST_Duration_value: {
        Method: "POST",
        ParentIDs: ["GET_Duration_WebId"],
        Content:
          '{"Value":"' +
          duration +
          '", "Timestamp": "' +
          now.toISOString() +
          '",}',
        RequestTemplate: {
          Resource: "https://" + serverName + "/piwebapi/streams/{0}/value",
        },
        Parameters: ["$.GET_Duration_WebId.Content.WebId"],
      },
    };
  }
}
