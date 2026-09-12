const cards = [
  {
    id: "midnight-sun",
    title: "Midnight Sun",
    artist: "Free Coast",
    image: "assets/sample-cover.svg",
    imageDescription: "Abstract purple and orange sunset over a dark horizon",
    rotation: "-3deg",
  },
  {
    id: "blue-hour",
    title: "Night Hour",
    artist: "Soft Fabric",
    image: "assets/blue-hour.svg",
    imageDescription: "Blue moonlight reflected across calm ocean waves",
    rotation: "2deg",
  },
  {
    id: "afterglow",
    title: "Sunset Avenue",
    artist: "Velvet Glow",
    image: "assets/afterglow.svg",
    imageDescription: "Warm glowing circles floating above a dark landscape",
    rotation: "-1deg",
  },
];

const cardCollection = document.querySelector("#card-collection");
const addRoomButton = document.querySelector("#add-room-button");
const roomDialog = document.querySelector("#room-dialog");
const roomForm = document.querySelector("#room-form");
const roomTitleInput = document.querySelector("#room-title");
const roomCoverInput = document.querySelector("#room-cover");
const cancelRoomButton = document.querySelector("#cancel-room-button");
const roomListView = document.querySelector("#room-list-view");
const roomDetailView = document.querySelector("#room-detail-view");
const selectedCardArt = document.querySelector("#selected-card-art");
const selectedCardTitle = document.querySelector("#selected-card-title");
const selectedCardArtist = document.querySelector("#selected-card-artist");
const backButton = document.querySelector("#back-button");

let cardButtonToRestoreFocus = null;

function openCard(card, cardButton) {
  selectedCardArt.src = card.image;
  selectedCardArt.alt = card.imageDescription;
  selectedCardTitle.textContent = card.title;
  selectedCardArtist.textContent = card.artist;
  cardButtonToRestoreFocus = cardButton;

  roomListView.hidden = true;
  roomDetailView.hidden = false;
  document.body.classList.add("detail-open");
  backButton.focus();
}

function closeCard() {
  roomDetailView.hidden = true;
  roomListView.hidden = false;
  document.body.classList.remove("detail-open");
  cardButtonToRestoreFocus?.focus();
}

function createCard(card) {
  const article = document.createElement("article");
  article.className = "cover-card";
  article.dataset.cardId = card.id;
  article.style.setProperty("--card-rotation", card.rotation);

  const artwork = document.createElement("img");
  artwork.className = "cover-art";
  artwork.src = card.image;
  artwork.alt = card.imageDescription;

  const details = document.createElement("div");
  details.className = "cover-details";

  const title = document.createElement("h3");
  title.textContent = card.title;

  const artist = document.createElement("p");
  artist.textContent = card.artist;

  const openButton = document.createElement("button");
  openButton.className = "open-card-button";
  openButton.type = "button";
  openButton.setAttribute("aria-label", `Open ${card.title}`);
  openButton.addEventListener("click", () => openCard(card, openButton));

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.setAttribute("aria-label", `Delete ${card.title}`);
  deleteButton.innerHTML=`<img src ="assets/trash-svgrepo-com.svg" alt="Delete Card Icon">`



  deleteButton.addEventListener("click", () => {
    const cardIndex = cards.indexOf(card);

    if (cardIndex !== -1) {
      cards.splice(cardIndex, 1);

    }

    if (card.uploadedCover) {
      URL.revokeObjectURL(card.image);
    }

    article.remove();
  });

  details.append(title, artist);
  openButton.append(artwork, details);
  article.append(openButton, deleteButton);

  return article;
}

cards.forEach((card) => {
  cardCollection.append(createCard(card));
});

addRoomButton.addEventListener("click", () => {
  roomDialog.showModal();
  roomTitleInput.focus();
});

cancelRoomButton.addEventListener("click", () => {
  roomDialog.close();
});

roomCoverInput.addEventListener("change", () => {
  roomCoverInput.setCustomValidity("");
});

roomForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const coverFile = roomCoverInput.files[0];

  if (coverFile.type !== "image/svg+xml" && !coverFile.name.toLowerCase().endsWith(".svg")) {
    roomCoverInput.setCustomValidity("Choose an SVG cover file.");
    roomCoverInput.reportValidity();
    return;
  }

  const formData = new FormData(roomForm);
  const title = formData.get("title").trim();
  const artist = formData.get("artist").trim();
  const newCard = {
    id: crypto.randomUUID(),
    title,
    artist,
    image: URL.createObjectURL(coverFile),
    imageDescription: `${title} cover`,
    rotation: "0deg",
    uploadedCover: true,
  };

  cards.push(newCard);
  cardCollection.append(createCard(newCard));
  roomDialog.close();
});

roomDialog.addEventListener("close", () => {
  roomForm.reset();
  roomCoverInput.setCustomValidity("");
});

backButton.addEventListener("click", closeCard);
