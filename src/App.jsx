import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      const response = await axios.get(
        "https://site--backend-deliveroo--vcs8yyfznmn8.code.run/"
      );

      setData(response.data);
      setIsLoading(false);
    };

    fetchdata();
  }, []);

  const addToCart = (meal) => {
    const cartCopy = [...cart];
    const index = cartCopy.findIndex((item) => item.id === meal.id);

    if (index !== -1) {
      cartCopy[index].quantity += 1;
    } else {
      const mealToPush = { ...meal, quantity: 1 };
      cartCopy.push(mealToPush);
    }

    setCart(cartCopy);
  };

  const handleClickMinus = (item) => {
    const cartCopy = [...cart];
    const index = cartCopy.findIndex((elem) => elem.id === item.id);
    cartCopy[index].quantity = cartCopy[index].quantity - 1;
    if (cartCopy[index].quantity === 0) {
      cartCopy.splice(index, 1);
    }
    setCart(cartCopy);
  };

  const handleClickPlus = (item) => {
    const cartCopy = [...cart];
    const index = cartCopy.findIndex((elem) => elem.id === item.id);
    cartCopy[index].quantity = cartCopy[index].quantity + 1;
    setCart(cartCopy);
  };

  const cartSubTotal = () => {
    let sum = 0;
    cart.map((item) => {
      sum = sum + item.price * item.quantity;
    });

    sum = sum.toFixed(2).replace(".", ",");
    return sum;
  };

  const deliveryFee = () => {
    let fee = 2.5;
    fee = fee.toFixed(2).replace(".", ",");
    return fee;
  };

  const cartTotal = () => {
    let total = cartSubTotal() + deliveryFee;
    total = total.toFixed(2).replace(".", ",");
    return total;
  };

  console.log(cart);

  // console.log(data);
  return isLoading ? (
    <p>Loading ...</p>
  ) : (
    <>
      <div>
        <header>
          <div className="container">
            <img src="src/assets/images/logo-teal.svg" alt="" />
          </div>
        </header>
        <section className="presentation">
          <div className="container">
            <div>
              <h1>{data.restaurant.name}</h1>
              <p>{data.restaurant.description}</p>
            </div>
            <div>
              <img src={data.restaurant.picture} alt="" />
            </div>
          </div>
        </section>
        <section className="container">
          <aside>
            <div className="cart">
              <button>Valider mon panier</button>
              <div>
                {cart.length === 0 ? (
                  <p className="emptyCart">Votre panier est vide</p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div key={item.id} className="cartItem">
                        <div>
                          <button
                            onClick={() => {
                              handleClickMinus(item);
                            }}
                          >
                            -
                          </button>
                          <p>{item.quantity}</p>
                          <button
                            onClick={() => {
                              handleClickPlus(item);
                            }}
                          >
                            +
                          </button>
                        </div>
                        <p>{item.name}</p>
                        <p>{item.price * item.quantity}€</p>
                      </div>
                    ))}
                    <div>
                      <div>
                        <p>Sous-total</p>
                        <p>{cartSubTotal()}€</p>
                      </div>
                      <div>
                        <p>Frais de livraison</p>
                        <p>{deliveryFee()}€</p>
                      </div>
                      <div>
                        <p>Total</p>
                        <p>{cartSubTotal()}€</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>

          <div>
            {data.categories.map((cat) => {
              if (cat.meals.length !== 0) {
                return (
                  <div key={cat.name} className="category">
                    <h2>{cat.name}</h2>
                    <div>
                      {cat.meals.map((meal) => {
                        return (
                          <div
                            key={meal.id}
                            className="card"
                            onClick={() => {
                              addToCart(meal);
                            }}
                          >
                            <div>
                              <h3>{meal.title}</h3>
                              <p>{meal.description}</p>
                              <div className="cardInfos">
                                <p>{meal.price} €</p>
                                <p className="popular">
                                  {meal.popular ? "Populaire" : null}
                                </p>
                              </div>
                            </div>
                            {meal.picture && <img src={meal.picture} alt="" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
