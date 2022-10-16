class Product {
  constructor(name) {
    const parent = document.getElementById(name);
    this.products = [...parent.children];
    this.changeSelectedHandler = this.changeSelected.bind(this);
    this.products.forEach(product => {
      product.addEventListener("click", this.changeSelectedHandler);
      product.addEventListener("click", validityCheck);
    });
    this.selected = undefined;
  }
  changeSelected(e) {
    e.preventDefault();
    if (e.currentTarget !== this.selected) {
      this.selected?.classList.remove("selected");
      e.currentTarget.classList.add("selected");
      this.selected = e.currentTarget;
    }
  }
  removeValidityCheck() {
    this.products.forEach(product => {
      product.removeEventListener("click", validityCheck);
    });
  }
}

//only place you need to change to add more types of products
const productTypes = [
  new Product("meals"),
  new Product("beverages"),
  new Product("deserts")
];

function validityCheck() {
  let valid = true;
  productTypes.forEach(productType => {
    valid = valid && productType.selected;
  });
  if (valid) {
    const confirmButton = document.getElementById("confirm-button");
    const leaveButton = document.getElementById("cancel");
    const sendButton = document.getElementById("send-button");
    confirmButton.innerHTML = "<p>Fechar pedido</p>";
    confirmButton.classList.add("valid");
    productTypes.forEach(productType => {
      productType.removeValidityCheck();
    });
    confirmButton.addEventListener("click", showConfirmationPage);
    leaveButton.addEventListener("click", hideConfirmationScreen);
    sendButton.addEventListener("click", sendResquest);
  }
}

let whatsAppText;
function showConfirmationPage() {
  const confirmationPage = document.getElementById("confirmation-page");
  const lines = confirmationPage.firstElementChild.querySelectorAll(".c-line");
  let totalPrice = 0;
  whatsAppText = "Olá, gostaria de fazer o pedido:\n- Prato: ";
  const trailingString = [
    "\n- Bebida: ",
    "\n- Sobremesa: ",
    "\nTotal: R$ "
  ];
  const currencySymbolLen = 3;
  for (let i = 0; i < productTypes.length; i++) {
    const foodName = productTypes[i].selected.querySelector(".strong").innerText;
    lines[i].firstElementChild.innerText = foodName;
    whatsAppText += foodName;
    whatsAppText += trailingString[i];

    const price = productTypes[i].selected.querySelector(".price").innerText.substr(currencySymbolLen);
    lines[i].lastElementChild.innerText = price;
    totalPrice += parseFloat(price.replace(",", "."));
  }
  const pricePrecision = 2;
  totalPrice = totalPrice.toFixed(pricePrecision);
  whatsAppText += totalPrice;
  whatsAppText += "\n\n";
  const priceText = ("R$ " + totalPrice).replace(".", ",");
  lines[productTypes.length].lastElementChild.innerText = priceText;
  confirmationPage.classList.add("show");
}

function hideConfirmationScreen() {
  const confirmationPage = document.getElementById("confirmation-page");
  confirmationPage.classList.remove("show");
}

const restaurantNumber = 5512996368491;

function sendResquest() {
  const name = prompt("Escreva seu nome: ");
  const address = prompt("Escreva o endereço de entrega: (Rua ..., n° ...)");

  if (name && address) {
    whatsAppText += `Nome: ${name}\n`;
    whatsAppText += `Endereço: ${address}\n\n`;
    window.open(`https://wa.me/${restaurantNumber}?text=${encodeURIComponent(whatsAppText)}`, "_blank");
    hideConfirmationScreen();
  } else {
    alert("Tente outra vez, lembrando de preencher os dados!");
  }
}
