import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
  matchPath,
} from "react-router-dom";
import Inscription from "./Page/Utilisateur/Compte/Inscription";
import CreateBets from "./Page/Bets/Create/CreateBets";
import CreateMiniBets from "./Page/Bets/Create/CreateMiniBets";
import CreateFlash from "./Page/Bets/Create/CreateFlash";
import Home from "./Page/Bets/Affichage_Home/Home";
import Connexion from "./Page/Utilisateur/Compte/Connexion";
import BottomNavBar from "./Components/BottomNavbar";
import ButtonAppBar from "./Components/TopNavbar";
import ManageBets from "./Page/Bets/Manage/ManageBets";
import UsersList from "./Page/Utilisateur/Liste Joueurs/ListUser";
import Collection from "./Page/Cartes/Collection";
import PackOpening from "./Page/Cartes/Packopening";
import Messagerie from "./Page/Utilisateur/Compte/Messagerie";
import PageFlash from "./Page/Flash/pageFlash";
import ManageMiniBet from "./Page/Bets/Manage/ManageMiniBets";
import AddOrganisation from "./Page/SuperAdmin/AddOrganisation";
import Dashboard from "./Page/Admin/Dashboard";
import AttenteInscription from "./Page/Utilisateur/Compte/AttenteInscription";

import { UserProvider, useUser } from "./Services/ContexteUser";

function NavigationWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const { user, loading } = useUser(); // Accès aux informations de l'utilisateur

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const isAuthPage =
      location.pathname === "/connexion" ||
      matchPath("/inscription/:token", location.pathname) ||
      location.pathname === "/attenteInscription"; // Utilise matchPath pour les routes dynamiques

    if (!token && !isAuthPage) {
      navigate("/connexion");
    }
  }, [navigate, location.pathname]);

  const hideNav =
    matchPath("/inscription/:token", location.pathname) ||
    location.pathname === "/connexion" ||
    matchPath("/createBet", location.pathname) ||
    matchPath("/createMiniBet", location.pathname) ||
    matchPath("/createFlash", location.pathname) ||
    location.pathname === "/flash" ||
    location.pathname === "/packopening" ||
    location.pathname === "/attenteInscription";

  if (loading) {
    return <div>Loading...</div>; // Affiche un loader pendant que les données utilisateur sont récupérées
  }

  return (
    <>
      {!hideNav && <ButtonAppBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription/:token" element={<Inscription />} />
        <Route path="/createBet" element={<CreateBets />} />
        <Route path="/createMiniBet" element={<CreateMiniBets />} />
        <Route path="/createFlash" element={<CreateFlash />} />
        <Route path="/manageBets/:idBet" element={<ManageBets />} />
        <Route path="/userlist" element={<UsersList />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/packopening" element={<PackOpening />} />
        <Route path="/messagerie" element={<Messagerie />} />
        <Route path="/flash" element={<PageFlash />} />

        <Route path="/addorganisation" element={<AddOrganisation />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/manageMiniBets/:idBet" element={<ManageMiniBet />} />

        <Route path="/attenteInscription" element={<AttenteInscription />} />
      </Routes>
      {!hideNav && <BottomNavBar />}
    </>
  );
}

function App() {
  return (
    <div className="App">
      <UserProvider>
        <Router>
          <NavigationWrapper />
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
