import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CadastroInvestimento from './components/CadastroInvestimento'
import ListagemInvestimentos from './components/ListagemInvestimentos'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>Gestão de Investimentos</h1>
          <div className="nav-links">
            <a href="/">Listagem</a>
            <a href="/cadastro">Cadastro</a>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<ListagemInvestimentos />} />
          <Route path="/cadastro" element={<CadastroInvestimento />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  )
}

export default App
