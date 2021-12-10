import ReactOnRails from 'react-on-rails';
import Products from '../components/Products';
import NewProduct from '../components/Products/new';
import SellPage from '../components/Pages/sell';
import Expense from '../components/Products/expense';
import SystemButtons from '../components/SystemButtons';
import Actions from '../components/Actions';
import EditAction from '../components/Actions/edit';
import Reservations from '../components/Reservations';
import Table from '../components/Reservations/table';
import Users from '../components/Users';
import Houses from '../components/Houses';
import House from '../components/Houses/show';
import Flat from '../components/Flats/show';
import Price from '../components/Price';

// This is how react_on_rails can see the HelloWorld in the browser.
ReactOnRails.register({
  Products,
  NewProduct,
  SellPage,
  Expense,
  SystemButtons,
  Actions,
  EditAction,
  Reservations,
  Table,
  Users,
  Houses,
  House,
  Flat,
  Price
});
