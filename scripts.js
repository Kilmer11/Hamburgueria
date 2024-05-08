const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const modal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutModal = document.getElementById("checkout-btn")
const closeModal = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const adressInput = document.getElementById("adress")
const adressWarn = document.getElementById("adress-warn")
const dateSpan = document.getElementById("date-span")


let cart = [];

//abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    modal.style.display = "flex"
    updateCartModal();
})

//Fechar o modal quando clicar fora
modal.addEventListener("click", function(event){
    if(event.target === modal){
        modal.style.display = "none"
    }
})

//Botão fechar
closeModal.addEventListener("click", function(){
    modal.style.display = "none"
})

menu.addEventListener("click", function(event){
     let parentButton = event.target.closest(".add-cart-btn")

     if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //Adicionar no carrinho
        addToCart(name, price)
     }
})

//Função para adiocionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

//Atualiza o carrinho no modal
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let quantidadeTotal = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");

        cartItemElement.innerHTML =  `
        <div class="flex items-center justify-between w-full">
            <div>
                <p class="font-medium">${item.name}</p>
                <p class="font-medium">R$ ${item.price.toFixed(2)}</p>
                <p>(quantidade: ${item.quantity})</p>
            </div>

            <div>
                <button class="remove-item-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        </div>
        `

        total += item.price * item.quantity;
        quantidadeTotal += item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.textContent = quantidadeTotal;
}

//função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-item-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

adressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(adressInput.value !== ""){
        adressWarn.classList.add("hidden")
    }
})

//Finalizar pedido
checkoutModal.addEventListener("click", function(){

    if(!checkHorarioRestaurante()){
        Toastify({
            text: "Restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if(cart.length === 0) return;

    if(adressInput.value === ""){
        adressWarn.classList.remove("hidden")
        return;
    }

    //Enviar pedido para o wtt
    const cartItem = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItem)
    const phone = "8899885107"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${adressInput.value}`, "_blank");

    cart = [];
    updateCartModal();
})

function checkHorarioRestaurante(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

if(checkHorarioRestaurante()){
    dateSpan.classList.remove("bg-red-500");
    dateSpan.classList.add("bg-green-600");
}else{
    dateSpan.classList.add("bg-red-500");
    dateSpan.classList.remove("bg-green-600");
}