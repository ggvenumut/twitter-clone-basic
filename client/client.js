const form = document.querySelector("form");
const loadingElement = document.querySelector(".loading");
const twits = document.querySelector(".twits");
const API_URL = "http://localhost:5000/data";

loadingElement.style.display = "";
listAllTwit();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const name = formData.get("name");
  const content = formData.get("content");

  const data = {
    name: name,
    content: content,
  };

  form.style.display = "none";
  loadingElement.style.display = "";

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((createdData) => {
      form.reset();

      setTimeout(() => {
        form.style.display = "";
      }, 10000);

      listAllTwit();
    });
});

function listAllTwit() {
  twits.innerHTML = "";
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      data.reverse();
      data.forEach((item) => {
        const div = document.createElement("div");

        const header = document.createElement("h3");
        header.textContent = item.name;

        const contents = document.createElement("p");
        contents.textContent = item.content;

        const date = document.createElement("small");
        date.textContent = new Date(item.created);

        div.appendChild(header);
        div.appendChild(contents);
        div.appendChild(date);
        twits.appendChild(div);
      });
      loadingElement.style.display = "none";
    });
}
