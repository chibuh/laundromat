import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIN from './components/SignIN';
import Student from "./components/Student/Student";
import Manager from "./components/Manager/Manager";

// import ProtectedRouteReg from "./ProtectedRouteReg";
// import ProtectedRouteReg2 from "./ProtectedRouteReg";


function App() {

  return (
    <>
      <Router>
          <Routes>
              <Route path={process.env.PUBLIC_URL + '/'} element={<SignIN />} />
                <Route path={process.env.PUBLIC_URL +'/student'} element={<Student />}/>
                <Route path={process.env.PUBLIC_URL +'/manager'} element={<Manager />}/>
          </Routes>
      </Router>
    </>
  );
}

export default App;
