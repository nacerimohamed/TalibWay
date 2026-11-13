
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
    } finally {
      navigate('/login')
    }
  }

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-brand">
          <span className="dashboard-brand-icon">T</span>
          Talib<span>Way</span>
        </Link>

        <div className="sidebar-label">MENU PRINCIPAL</div>

        <nav className="dashboard-nav">
          <Link to="/dashboard" className="dashboard-nav-link active">
            <span>⌂</span>
            Tableau de bord
          </Link>

          <a href="#profile" className="dashboard-nav-link">
            <span>◉</span>
            Mon profil
          </a>

          <Link
  to="/dashboard/recommendations"
  className="dashboard-nav-link"
>
  <span>✦</span>
  Mes recommandations
</Link>

          <a href="#formations" className="dashboard-nav-link">
            <span>▤</span>
            Formations
          </a>
        </nav>

        <div className="sidebar-bottom">
          <Link to="/" className="dashboard-nav-link">
            <span>←</span>
            Retour au site
          </Link>

          <button
            className="dashboard-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">

        <header className="dashboard-header">
          <div>
            <span className="dashboard-date-label">
              ESPACE ÉTUDIANT
            </span>
            <h1>Tableau de bord</h1>
          </div>

          <div className="dashboard-user">
            <div className="dashboard-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user?.name}</strong>
              <small>Mon compte</small>
            </div>
          </div>
        </header>

        <section className="dashboard-welcome">
          <div>
            <span>BIENVENUE SUR TALIBWAY</span>
            <h2>Bonjour {user?.name} !</h2>
            <p>
              Prépare ton avenir. Complète ton profil scolaire
              pour découvrir les formations qui te correspondent.
            </p>
            <a href="#profile" className="dashboard-primary-button">
              Compléter mon profil <span>↗</span>
            </a>
          </div>

          <div className="welcome-decoration">T</div>
        </section>

        {/* Overview */}
        <section className="dashboard-overview">
          <div className="overview-card" id="profile">
            <div className="overview-icon blue">◉</div>
            <div>
              <span>Mon profil scolaire</span>
              <strong>À compléter</strong>
              <small>Ajoute tes informations scolaires</small>
            </div>
          </div>

          <div className="overview-card" id="recommendations">
            <div className="overview-icon purple">✦</div>
            <div>
              <span>Recommandations</span>
              <strong>En attente</strong>
              <small>Complète ton profil pour commencer</small>
            </div>
          </div>

          <div className="overview-card" id="formations">
            <div className="overview-icon orange">▤</div>
            <div>
              <span>Formations</span>
              <strong>À découvrir</strong>
              <small>Explore les possibilités au Maroc</small>
            </div>
          </div>
        </section>

        {/* Profile section */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-section-tag">PREMIÈRE ÉTAPE</span>
              <h2>Construisons ton profil scolaire</h2>
              <p>
                Quelques informations nous permettront de mieux
                comprendre ton parcours et tes objectifs.
              </p>
            </div>
          </div>

          <div className="profile-start-card">
            <div className="profile-start-icon">✎</div>

            <div className="profile-start-content">
              <h3>Renseigne ton parcours académique</h3>
              <p>
                Indique ton diplôme, ta filière, tes notes et
                tes domaines d'intérêt.
              </p>
            </div>

            <button
              className="dashboard-primary-button"
              onClick={() => navigate('/dashboard/profile')}
            >
              Commencer <span>↗</span>
            </button>
          </div>
        </section>

        <footer className="dashboard-footer">
          © 2026 TalibWay. Tous droits réservés.
        </footer>

      </main>
    </div>
  )
}

export default Dashboard
