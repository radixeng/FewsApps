async function setMessage() {
  const messageL1 = document.getElementById("messageL1").value;
  const messageL2 = document.getElementById("messageL2").value;
  const messageL3 = document.getElementById("messageL3").value;
  const setTimeInput = document.getElementById("setTimeInput").value;

  const currentUrl = window.location.host;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  //headers.append("Authorization", "");
  //headers.append("X-Requested-With", "");

  const now = new Date();
  const elementPath = getUrlPath();
  const content = bodyBuilder(
    currentUrl,
    elementPath,
    now,
    messageL1,
    messageL2,
    messageL3,
    setTimeInput
  );
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
  function bodyBuilder(
    serverName,
    elementPath,
    now,
    messageL1,
    messageL2,
    messageL3,
    setTimeInput
  ) {
    return {
      GET_Message_L1_WebID: {
        Method: "GET",
        Resource:
          "https://" +
          serverName +
          "/piwebapi/attributes?path=" +
          elementPath +
          "|L1+Display+Message|L1+Message+of+the+Day",
      },
      POST_Message_L1_Value: {
        Method: "POST",
        ParentIDs: ["GET_Message_L1_WebID"],
        Content:
          '{"Value": "' +
          messageL1 +
          '", "Timestamp": "' +
          now.toISOString() +
          '",}',
        RequestTemplate: {
          Resource: "https://" + serverName + "/piwebapi/streams/{0}/value",
        },
        Parameters: ["$.GET_Message_L1_WebID.Content.WebId"],
      },
      GET_Message_L2_WebID: {
        Method: "GET",
        Resource:
          "https://" +
          serverName +
          "/piwebapi/attributes?path=" +
          elementPath +
          "|L2+Display+Message|L2+Message+of+the+Day",
      },
      POST_Message_L2_Value: {
        Method: "POST",
        ParentIDs: ["GET_Message_L2_WebID"],
        Content:
          '{"Value": "' +
          messageL2 +
          '", "Timestamp": "' +
          now.toISOString() +
          '",}',
        RequestTemplate: {
          Resource: "https://" + serverName + "/piwebapi/streams/{0}/value",
        },
        Parameters: ["$.GET_Message_L2_WebID.Content.WebId"],
      },
      GET_Message_L3_WebID: {
        Method: "GET",
        Resource:
          "https://" +
          serverName +
          "/piwebapi/attributes?path=" +
          elementPath +
          "|L3+Display+Message|L3+Message+of+the+Day",
      },
      POST_Message_L3_Value: {
        Method: "POST",
        ParentIDs: ["GET_Message_L3_WebID"],
        Content:
          '{"Value": "' +
          messageL3 +
          '", "Timestamp": "' +
          now.toISOString() +
          '",}',
        RequestTemplate: {
          Resource: "https://" + serverName + "/piwebapi/streams/{0}/value",
        },
        Parameters: ["$.GET_Message_L3_WebID.Content.WebId"],
      },
      GET_Expiration_Time_WebID: {
        Method: "GET",
        Resource:
          "https://" +
          serverName +
          "/piwebapi/attributes?path=" +
          elementPath +
          "|L1+Display+Message|Expiration+Time+(Hours)",
      },
      POST_Expiration_Time_Value: {
        Method: "POST",
        ParentIDs: ["GET_Expiration_Time_WebID"],
        Content:
          '{"Value": "' +
          setTimeInput +
          '", "Timestamp": "' +
          now.toISOString() +
          '",}',
        RequestTemplate: {
          Resource: "https://" + serverName + "/piwebapi/streams/{0}/value",
        },
        Parameters: ["$.GET_Expiration_Time_WebID.Content.WebId"],
      },
    };
  }
}
