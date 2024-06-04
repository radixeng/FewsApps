async function setSnooze() {
  const snoozeMinutesOut = document.getElementById("snoozeMinutesOut").value;
  const snoozeMinutes = parseInt(snoozeMinutesOut.match(/\d+/)[0], 10);

  const currentUrl = window.location.host;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("X-Requested-With", "");

  const now = new Date();
  const elementPath = getUrlPath();
  const content = bodyBuilder(currentUrl, elementPath, now, snoozeMinutes);
  const parsedContent = JSON.stringify(content);
  //console.log(parsedContent);

  fetch("https://" + currentUrl + "/piwebapi/batch", {
    method: "POST",
    headers: headers,
    body: parsedContent,
  })
    .then(async (response) => {
      if (response.ok) return await response.json();
      else throw new Error("Network response failed ", response.json());
  })
    .then((response) => {
      getError(response);
        alert("Snooze set with success!");
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
  function getError(response) {
    // Iterate through the response object
    const errorArray = [];
    for (const key in response) {
      // Check if there are errors
      if (response[key].Status >= 300) {
        if (typeof response[key].Content === "string") {
          errorArray.push({
            status: response[key].Status,
            message: response[key].Content,
          });
        } else if (response[key].Content.Errors) {
          errorArray.push({
            status: response[key].Status,
            message: response[key].Content.Errors[0],
          });
        }
      }
    }
    // Prioritize lower error codes, if any
    if (errorArray.length > 0) {
      errorArray.sort((a, b) => {
        return a.status - b.status;
      });
      const firstError = errorArray[0];
      throw new Error(`${firstError.status} ${firstError.message}`);
    }
  }
}
