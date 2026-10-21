import { useEffect, useState } from "react";
import "./App.css";
const coffees = [
  { id: 1, name: "Latte", price: 15, image: "/images/latte.jpg" },
  { id: 2, name: "Espresso", price: 10, image: "/images/espresso.jpg" },
  { id: 3, name: "Cappuccino", price: 14, image: "/images/cappuccino.jpg" },
  { id: 4, name: "Americano", price: 20, image: "/images/americano.jpg" },
];

function Welcome(props) {
  return <h2>Welcome, {props.name}!</h2>;
}

function CoffeeMenu() {
  return <h2>Our Coffee Menu</h2>;
}

function CoffeeCard(props) {
  return (
    <div className="coffee-card">
      <img src={props.image} alt={props.name} />
      <h2>{props.name}</h2>
      <p>{props.price} SAR</p>

      <button onClick={props.onAdd}>Add Order</button>
    </div>
  );
}

function App() {
  const [order, setOrder] = useState(() => {
    try {
      const savedOrder = localStorage.getItem("brew-house-order");
      return savedOrder ? JSON.parse(savedOrder) : [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const totalItems = order.length;
  const message =
    totalItems === 0
      ? "Your order is empty!"
      : totalItems === 10
        ? "You reached the maximum order!"
        : `You have ${totalItems} cups in your order.`;
  //استدعاء التخزين
  useEffect(() => {
    localStorage.setItem("brew-house-order", JSON.stringify(order));
  }, [order]);

  // دالة إضافة القهوة
  function addOrder(coffee) {
    if (order.length >= 10) {
      alert("Maximum 10 cups per order!");
      return;
    }

    if (order.length === 7) {
      alert("Your order will have 8 cups. You can add 2 more!");
    }

    setOrder([...order, coffee]);
  }

  // دالة حذف القهوة
  function removeOrder(coffeeId) {
    setOrder((currentOrder) => {
      const index = currentOrder.findIndex((item) => item.id === coffeeId);

      if (index === -1) {
        return currentOrder;
      }

      return currentOrder.filter((item, i) => i !== index);
    });
  }

  //لمسح الطلب كاملا
  function clearOrder() {
    const confirmed = window.confirm(
      "Are you sure you want to clear your order?",
    );
    if (confirmed) {
      setOrder([]);
    }
  }

  // متغير يحسب كمية كل نوع قهوة طلبه المستخدم، ويخزّن النتيجة في متغير
  const orderItems = coffees.map((coffee) => {
    const quantity = order.filter((item) => item.id === coffee.id).length;

    return {
      ...coffee,
      quantity: quantity,
    };
  });

  const total = orderItems.reduce((sum, coffee) => {
    return sum + coffee.price * coffee.quantity;
  }, 0);

  return (
    <>
      <h1>Brew House</h1>
      <Welcome name="Maria" />

      <div className="search-box">
        <input
          type="text"
          placeholder="Search coffee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setSearch("")}>Clear</button>
      </div>
      <CoffeeMenu />
      {!coffees.some((coffee) =>
        coffee.name.toLowerCase().includes(search.toLowerCase()),
      ) && <p>No coffee found!</p>}
      <div className="coffee-grid">
        {coffees
          .filter((coffee) =>
            coffee.name.toLowerCase().includes(search.toLowerCase()),
          )
          .map((coffee) => (
            <CoffeeCard
              key={coffee.id}
              name={coffee.name}
              price={coffee.price}
              image={coffee.image}
              onAdd={() => addOrder(coffee)}
            />
          ))}
      </div>

      <div className="order-heading">
        <h2>Your Order</h2>
        <p>{message}</p>
        <span className="order-count">{totalItems} cups</span>
      </div>
      <div className="order-list">
        {orderItems
          .filter((coffee) => coffee.quantity > 0)
          .map((coffee) => (
            <div className="order-item" key={coffee.id}>
              <p className="order-name">{coffee.name}</p>

              <div className="order-quantity">
                <button
                  className="quantity-btn"
                  onClick={() => removeOrder(coffee.id)}
                >
                  −
                </button>
                <span className="quantity">{coffee.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => addOrder(coffee)}
                >
                  +
                </button>
              </div>
              <p className="order-price">
                {coffee.price * coffee.quantity} SAR
              </p>
            </div>
          ))}
      </div>
      <h2>Total: {total} SAR</h2>
      <button
        className="clear-Order-btn"
        onClick={clearOrder}
        disabled={order.length === 0}
      >
        Clear Order
      </button>
      <button
        disabled={order.length === 0}
        className="place-order-btn"
        onClick={() => {
          if (order.length === 0) {
            alert("Your order is empty!");
          } else {
            alert("Your order has been placed!");
            setOrder([]);
          }
        }}
      >
        Place Order
      </button>
    </>
  );
}
export default App;
