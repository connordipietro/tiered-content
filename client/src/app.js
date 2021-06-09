import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  LoginPage,
  PaymentPage,
  ProductsPage,
  AdminPage,
  HomePage,
} from './pages';

const stripePromise = loadStripe(
  'pk_test_51IxgMNF6tBtQLmcj8F8QFcsxYnXfhn8g1Q4xwS0DMW5WVpu7mwj7YsY9MpKaKQX9Bw9FrWmilb23M0huqfpwI92p00jUV5Ti5c'
);

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/payment">
            <Elements stripe={stripePromise}>
              <PaymentPage />
            </Elements>
          </Route>
          <Route exact path="/products" component={ProductsPage} />
          <Route exact path="/admin" component={AdminPage} />
          <Route exact path="/home" component={HomePage} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
