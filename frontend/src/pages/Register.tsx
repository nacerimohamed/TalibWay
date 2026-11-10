
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api'
import './Register.css'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    setLoading(true)

    try {
      await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      })

      setSuccess(true)
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

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card success-card">
          <Link to="/" className="auth-brand">
            <span className="auth-brand-icon">T</span>
            Talib<span>Way</span>
          </Link>

          <div className="success-icon">✓</div>

          <h1>Vérifiez votre adresse email</h1>

          <p className="auth-description">
            Votre compte a été créé avec succès !
            Nous avons envoyé un lien de vérification à :
          </p>

          <strong className="registered-email">{email}</strong>

          <p className="auth-description">
            Ouvrez votre boîte mail et cliquez sur le lien
            pour activer votre compte TalibWay.
          </p>

          <div className="email-help">
            Pensez également à vérifier votre dossier Spam.
          </div>

          <Link to="/login" className="auth-submit">
            Aller à la connexion
          </Link>

          <Link to="/" className="auth-back">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-icon">T</span>
          Talib<span>Way</span>
        </Link>

        <div className="auth-heading">
          <span className="auth-eyebrow">REJOIGNEZ TALIBWAY</span>
          <h1>Créer votre compte</h1>
          <p>
            Commencez votre parcours et découvrez les formations
            adaptées à votre profil.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Nom complet</label>
            <input
              id="name"
              type="text"
              placeholder="Votre nom complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={2}
              maxLength={100}
              autoComplete="name"
              required
            />
          </div>

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
              placeholder="Minimum 8 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirmation">
              Confirmer le mot de passe
            </label>
            <input
              id="passwordConfirmation"
              type="password"
              placeholder="Confirmez votre mot de passe"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              autoComplete="new-password"
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
            {loading ? 'Création en cours...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="auth-switch">
          Vous avez déjà un compte ?
          {' '}
          <Link to="/login">Se connecter</Link>
        </p>

        <Link to="/" className="auth-back">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}

export default Register
