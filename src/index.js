import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import registerServiceWorker from './registerServiceWorker';
import { HashRouter as Router } from 'react-router-dom';
import ResponsiveDrawer from './components/HeaderBar/ResponsiveDrawer';
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import reducer from './reducers'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const store = createStore(reducer)
const theme = createMuiTheme({
    typography: {
      fontFamily: [
        'Microsoft JhengHei'
      ].join(',')
    }
});
  
ReactDOM.render(
    <Provider store={store}>
        <Router>
            <MuiThemeProvider theme={theme}>
                <ResponsiveDrawer />
            </MuiThemeProvider>
        </Router>
    </Provider>
    ,document.getElementById('root')
);
registerServiceWorker();
