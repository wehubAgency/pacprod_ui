import moment from 'moment';
import 'moment/locale/fr';
import store from '../store';

const { locale } = store.getState().general.locale;

const Imoment = moment;
Imoment.locale(locale);

export default Imoment;
