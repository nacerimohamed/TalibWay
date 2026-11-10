
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'
import './Register.css'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      })

      // Save the authentication token
      localStorage.setItem('talibway_token', data.token)

      // Save the authenticated user
      localStorage.setItem('talibway_user', JSON.stringify(data.user))

      navigate('/')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue. Réessayez.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon">T</span>
          Talib<span>Way</span>
        </Link>

        <div className="auth-heading">
          <span className="auth-eyebrow">BIENVENUE SUR TALIBWAY</span>
          <h1>Content de vous revoir !</h1>
          <p>
            Connectez-vous pour continuer votre parcours
            d'orientation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <p className="auth-switch">
          Vous n'avez pas encore de compte ?
          {' '}
          <Link to="/register">Créer un compte</Link>
        </p>

        <Link to="/" className="auth-back">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}

export default Login
