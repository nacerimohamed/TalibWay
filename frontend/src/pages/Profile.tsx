
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Profile.css'

function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [level, setLevel] = useState('bac_plus_2')
  const [stream, setStream] = useState('')
  const [diploma, setDiploma] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [city, setCity] = useState('')
  const [s1, setS1] = useState('')
  const [s2, setS2] = useState('')
  const [s3, setS3] = useState('')
  const [s4, setS4] = useState('')
  const [fields, setFields] = useState<string[]>([])
  const [message, setMessage] = useState('')

  const availableFields = [
    'Informatique',
    'Développement logiciel',
    'Data Science',
    'Intelligence artificielle',
    'Réseaux et systèmes',
    'Cybersécurité',
    'Gestion',
  ]

  function toggleField(field: string) {
    setFields((current) =>
      current.includes(field)
        ? current.filter((item) => item !== field)
        : [...current, field]
    )
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage('Formulaire prêt. La prochaine étape sera de connecter ces données au Backend.')
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button className="profile-back" onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
        <span className="profile-brand">TalibWay</span>
        <span className="profile-user">{user?.name}</span>
      </header>

      <main className="profile-container">
        <div className="profile-intro">
          <span className="profile-tag">MON ESPACE ÉTUDIANT</span>
          <h1>Complétez votre profil</h1>
          <p>
            Quelques informations nous permettront de vous proposer
            des formations adaptées à votre parcours.
          </p>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <section className="profile-section">
            <h2>01. Votre parcours académique</h2>

            <label>Niveau d'études actuel</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} required>
              <option value="bac">Baccalauréat</option>
              <option value="bac_plus_2">Bac +2</option>
              <option value="bac_plus_3">Bac +3</option>
            </select>

            <label>Votre filière</label>
            <input
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              placeholder="Ex : Sciences Physiques"
              required
            />

            {level !== 'bac' && (
              <>
                <label>Diplôme obtenu</label>
                <input
                  value={diploma}
                  onChange={(e) => setDiploma(e.target.value)}
                  placeholder="Ex : DTS"
                  required
                />

                <label>Spécialité</label>
                <input
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="Ex : Développement Digital - Web Full Stack"
                  required
                />
              </>
            )}

            <label>Ville</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex : Ouarzazate"
              required
            />
          </section>

          {level === 'bac_plus_2' && (
            <section className="profile-section">
              <h2>02. Vos notes semestrielles</h2>
              <p className="profile-hint">
                S1 et S2 : première année. S3 et S4 : deuxième année.
              </p>

              <div className="grades-grid">
                <div>
                  <label>S1</label>
                  <input type="number" min="0" max="20" step="0.01"
                    value={s1} onChange={(e) => setS1(e.target.value)} required />
                </div>
                <div>
                  <label>S2</label>
                  <input type="number" min="0" max="20" step="0.01"
                    value={s2} onChange={(e) => setS2(e.target.value)} required />
                </div>
                <div>
                  <label>S3</label>
                  <input type="number" min="0" max="20" step="0.01"
                    value={s3} onChange={(e) => setS3(e.target.value)} required />
                </div>
                <div>
                  <label>S4</label>
                  <input type="number" min="0" max="20" step="0.01"
                    value={s4} onChange={(e) => setS4(e.target.value)} required />
                </div>
              </div>
            </section>
          )}

          <section className="profile-section">
            <h2>03. Vos domaines d'intérêt</h2>
            <p className="profile-hint">
              Sélectionnez un ou plusieurs domaines.
            </p>

            <div className="fields-grid">
              {availableFields.map((field) => (
                <label className="field-option" key={field}>
                  <input
                    type="checkbox"
                    checked={fields.includes(field)}
                    onChange={() => toggleField(field)}
                  />
                  <span>{field}</span>
                </label>
              ))}
            </div>
          </section>

          {message && <p className="profile-message">{message}</p>}

          <button className="profile-submit" type="submit">
            Enregistrer mon profil
          </button>
        </form>
      </main>
    </div>
  )
}

export default Profile
