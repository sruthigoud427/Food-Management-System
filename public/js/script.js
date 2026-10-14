const grid = document.getElementById("foodGrid");
const menuMessage = document.getElementById("menuMessage");

let foodItems = [];
let currentFilter = "All";

const emojiFor = (name = "") => {
    const n = name.toLowerCase();

    if (n.includes("pizza")) return "🍕";
    if (n.includes("burger")) return "🍔";
    if (n.includes("biryani")) return "🍛";
    if (n.includes("paneer") || n.includes("tikka")) return "🥘";
    if (n.includes("idly") || n.includes("idli")) return "🥞";
    if (n.includes("sandwich")) return "🥪";
    if (n.includes("pasta")) return "🍝";
    if (n.includes("salad")) return "🥗";
    if (n.includes("cake")) return "🍰";
    if (n.includes("chicken")) return "🍗";
    if (n.includes("fries")) return "🍟";

    return "🍽️";
};

const money = value => `₹${Number(value).toFixed(2)}`;

const escapeHTML = value =>
    String(value ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));

async function loadFood() {
    grid.innerHTML =
        '<div class="loading-card">Loading delicious food...</div>';

    try {
        const response = await fetch("/api/food");

        if (!response.ok) {
            throw new Error("Unable to load food items.");
        }

        foodItems = await response.json();

        renderFood();

        menuMessage.textContent =
            `${foodItems.length} food items in your menu`;

        menuMessage.classList.remove("error");

    } catch (error) {
        grid.innerHTML =
            '<div class="empty-card">Unable to load food items. Please check your server.</div>';

        menuMessage.textContent = error.message;
        menuMessage.classList.add("error");
    }
}

function renderFood() {
    const visible = currentFilter === "All"
        ? foodItems
        : foodItems.filter(item => item.category === currentFilter);

    if (visible.length === 0) {
        grid.innerHTML =
            '<div class="empty-card">No food items found in this category.</div>';
        return;
    }

    grid.innerHTML = visible.map(item => {
        const available =
            item.availability === true ||
            item.availability === 1 ||
            item.availability === "1";

        const categoryClass =
            item.category === "Non-Vegetarian" ? "nonveg" : "";

        return `
            <article class="food-card">

                <div class="food-visual">

                    <span class="category-tag ${categoryClass}">
                        ${item.category === "Vegetarian" ? "🥬" : "🍗"}
                        ${escapeHTML(item.category)}
                    </span>

                    <span class="availability-tag ${available ? "" : "unavailable"}">
                        ${available ? "Available" : "Unavailable"}
                    </span>

                    <span class="food-emoji"
                          role="img"
                          aria-label="${escapeHTML(item.food_name)}">
                        ${emojiFor(item.food_name)}
                    </span>

                </div>

                <div class="food-info">

                    <h3>${escapeHTML(item.food_name)}</h3>

                    <p>
                        ${escapeHTML(item.description || "A tasty menu choice.")}
                    </p>

                    <div class="food-bottom">

                        <span class="price">
                            <small>PRICE </small>${money(item.price)}
                        </span>

                    </div>

                </div>

            </article>
        `;
    }).join("");
}

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {

        document.querySelectorAll(".filter").forEach(b => {
            b.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderFood();
    });
});

loadFood();