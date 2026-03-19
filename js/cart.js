// ============================================================
//  cart.js – Cart logic using localStorage
// ============================================================

const CART_KEY = "wanderlux_cart";

const Cart = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch { return []; }
  },

  save(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    Cart._dispatchUpdate();
  },

  add(circuitId, date, adults, children) {
    const circuit = CIRCUITS.find(c => c.id === circuitId);
    if (!circuit) return false;

    const items = Cart.get();
    const itemId = `${circuitId}_${date}_${Date.now()}`;
    const childPrice = circuit.price * 0.5;
    const total = (adults * circuit.price) + (children * childPrice);

    items.push({
      itemId,
      circuitId,
      title: circuit.title,
      city: circuit.city,
      country: circuit.country,
      image: circuit.image,
      date,
      adults: parseInt(adults) || 1,
      children: parseInt(children) || 0,
      pricePerAdult: circuit.price,
      pricePerChild: childPrice,
      total,
    });

    Cart.save(items);
    return true;
  },

  remove(itemId) {
    const items = Cart.get().filter(i => i.itemId !== itemId);
    Cart.save(items);
  },

  update(itemId, adults, children) {
    const items = Cart.get();
    const item = items.find(i => i.itemId === itemId);
    if (!item) return;
    item.adults = parseInt(adults) || 1;
    item.children = parseInt(children) || 0;
    item.total = (item.adults * item.pricePerAdult) + (item.children * item.pricePerChild);
    Cart.save(items);
  },

  clear() {
    Cart.save([]);
  },

  count() {
    return Cart.get().length;
  },

  grandTotal() {
    return Cart.get().reduce((sum, i) => sum + i.total, 0);
  },

  _dispatchUpdate() {
    document.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: Cart.count() } }));
  },
};

// ── Cart badge update ────────────────────────────────────────
function initCartBadge() {
  function update() {
    const count = Cart.count();
    document.querySelectorAll(".cart-badge").forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? "flex" : "none";
    });
  }
  update();
  document.addEventListener("cart:updated", update);
}

document.addEventListener("DOMContentLoaded", initCartBadge);
