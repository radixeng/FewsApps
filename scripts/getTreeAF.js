async function getTreeAF() {
  const username = document.getElementById("usernameInput").value;
  const password = document.getElementById("passwordInput").value;

  //console.log("Username:", username);
  //console.log("Password:", password);

  const url = "https://rdx-04-dev-pivs.rdxpims.local/piwebapi";
  const token = btoa(username + ":" + password);
  const headers = new Headers();
  headers.append("Authorization", "Basic " + token);
  headers.append("Content-Type", "application/json");

  const qs = new URLSearchParams({
    path: "\\\\RDX-03-DEV-PIAF\\Henrique Lozano - Remapeamento OuroVerde\\Ouro Verde",
  });

  try {
    const rootRes = await fetch(url + "/elements" + qs, {
      method: "GET",
      headers: headers,
    });
    const rootElement = rootRes.json();
    let hasChildren = rootElement.HasChildren;

    const childRes = await fetch(rootElement.Links.Elements, {
      method: "GET",
      headers: headers,
    });

    while (hasChildren) {
      const res = await fetch(url + "/elements" + qs, {
        method: "GET",
        headers: headers,
        body: content,
        mode: "cors",
      });
      const rootElement = res.json();
      const hasChildren = rootElement.HasChildren;
    }
  } catch (error) {
    alert(error);
  }
}
