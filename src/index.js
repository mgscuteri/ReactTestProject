import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import './index.css';

function NavBar() {
    return (
      <ul className = 'navBar'>
          <li><Link to = '/'> Home/Enter ThemeSong </Link> </li>
          <li><Link to = '/how-it-works'> How it Works </Link> </li>
      </ul>
    );
}

class MainWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {            
            isValid: true,
        }
    }
    render() {  
        return(
            <div className = 'mainWindow'>
                <Switch>
                    <Route exact path='/' component={EnterThemeSong}/>                    
                    <Route path='/how-it-works' component={HowItWorks}/>
                </Switch>
            </div>
        )
    }
}

function HowItWorks() {
    return (
      <div className = 'howItWorks'>

      </div>
    );
}  

function EnterThemeSong() {
    return (
      <div className = 'howItWorks'>
        <div className = 'title'> Welcome to Mike's house! </div>                
                Guests of Mike's house each get their own themesong! Go ahead and enter it below!
                Or, click here to learn about how it works! 
      </div>
    );
} 

class App extends React.Component {
    render() {    
        return (            
            <div className = 'wrapper'> 
                <NavBar />
                <MainWindow />
            </div>
        );
    }
}
  
// ========================================
  
ReactDOM.render((
    <BrowserRouter>
      <App />
    </BrowserRouter>
  ), document.getElementById('root')
)


//https://codepen.io/gaearon/pen/gWWZgR?editors=0010