import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSelector from "./components/LoginSelector";
import IndividualUserLogin from './components/IndividualUserLogin';
import AdminLogin from './components/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSelector />} />
        <Route path="/individual" element= {<IndividualUserLogin/>}/>
        <Route path="/admin" element= {<AdminLogin/>}/>
      </Routes>
    </Router>
  );
}

export default App;

