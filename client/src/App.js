import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSelector from "./components/LoginSelector";
import IndividualUserLogin from './components/IndividualUserLogin';
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './pages/AdminDashboard';
import PersonalInfoForm from './components/PersonalInfoForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSelector />} />
        <Route path="/individual" element= {<IndividualUserLogin/>}/>
        <Route path="/admin" element= {<AdminLogin/>}/>
        <Route
          path="/admin/dashboard"
          element={
            <AdminDashboard/>
          }
        />
        <Route path="/userform" element={<PersonalInfoForm/>}/>
      </Routes>
    </Router>
  );
}

export default App;

