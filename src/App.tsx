import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProjectProvider, WalletProvider } from './contexts';
import { Home, Error, About, Clients, Access, ViewCert, Payment } from './pages/';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'react-coinbase-commerce/dist/coinbase-commerce-button.css';

import './App.scss';
import Guide from './pages/Guide';
import Issuers from './pages/Issuers';
import AddCredit from './pages/AddCredit';
import Mint from './pages/Mint';
import { NftProvider } from './contexts/NftContext';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import ProjectReview from './pages/ProjectReview';
import { IssuerProvider } from './contexts/IssuerContext';

function App() {
  return (
    <WalletProvider>
      <IssuerProvider>
        <ProjectProvider>
          <NftProvider>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              theme="colored"
              pauseOnFocusLoss
              draggable
              pauseOnHover
              style={{ width: '360px' }}
            />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/issuers" element={<Issuers />} />
                <Route path="/issuers/review/:projectid" element={<ProjectReview />} />
                <Route path="/addCredit" element={<AddCredit />} />
                <Route path="/generate" element={<Mint />} />
                <Route path="/access" element={<Access />} />
                <Route path="/claim" element={<Access />} />
                <Route path="/access/:tokenid" element={<ViewCert />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<Error />} />
              </Routes>
            </BrowserRouter>
          </NftProvider>
        </ProjectProvider>
      </IssuerProvider>
    </WalletProvider>
  );
}

export default App;
