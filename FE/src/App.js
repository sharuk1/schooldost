import logo from './logo.svg';
import './App.css';
import {HashRouter,Routes,Route}  from "react-router-dom"
import { Routing } from './Constant/Routing';
import { AlertComponent, DialogComponent } from './Component/Notification';
import { AppbarComponent } from './Component/Menubar';
import { useSelector, useDispatch } from "react-redux"

function App() {
  const {sideMenu,isLogin} = useSelector(state => state.user);
  
  
  return (
        <HashRouter>
          {
            isLogin?
              <AppbarComponent menuList={sideMenu}/>
              :
              null
          }
          <AlertComponent/>
          <DialogComponent/>
          <Routes>
            {
              Routing.map(({url,component})=>
                <Route path={url} element={component} />
              )
            }
          </Routes>
        </HashRouter>
  );
}

export default App;
