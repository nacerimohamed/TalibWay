
import { useEffect, useState } from 'react'
import { apiRequest } from '../services/api'
import './Recommendations.css'

interface Formation {
  name: string
  institution: string
  institution_type: string
  city: string
  official_url: string | null
  source_name: string | null
  last_verified: string | null
  minimum_average: number | null
  admission_conditions: string[]
  admission_method: string
}

interface Recommendation {
  formation: Formation
  score: number
  eligibility:
    | 'not_eligible'
    | 'needs_verification'
    | 'potentially_eligible'
  reasons: string[]
  warnings: string[]
}

interface RecommendationsResponse {
  message: string
  total: number
  recommendations: Recommendation[]
}

function Recommendations() {
  const [data, setData] = useState<RecommendationsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadRecommendations() {
    setLoading(true)
    setError('')

    try {
      const response = await apiRequest('/recommendations', {
        method: 'POST',
        body: JSON.stringify({}),
      })

      setData(response)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecommendations()
  }, [])

  function getEligibilityLabel(status: Recommendation['eligibility']) {
    if (status === 'potentially_eligible') {
      return 'Compatibilité selon les critères disponibles'
    }

    if (status === 'not_eligible') {
      return 'Conditions connues non compatibles'
    }

    return 'Vérification nécessaire'
  }

  return (
    <div className="recommendations-page">
      <header className="recommendations-header">
        <div>
          <p className="recommendations-eyebrow">TALIBWAY · ORIENTATION</p>
          <h1>Mes recommandations</h1>
          <p>
            Découvrez les formations qui correspondent à votre profil
            académique et à vos domaines d’intérêt.
          </p>
        </div>

        <button
          className="recommendations-refresh"
          onClick={loadRecommendations}
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Actualiser'}
        </button>
      </header>

      {loading && (
        <div className="recommendations-message">
          Analyse de votre profil et recherche des formations...
        </div>
      )}

      {!loading && error && (
        <div className="recommendations-error">
          <h3>Impossible de charger les recommandations</h3>
          <p>{error}</p>
          <button onClick={loadRecommendations}>
            Réessayer
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="recommendations-summary">
            <div>
              <span className="summary-number">{data.total}</span>
              <span className="summary-label">
                formations recommandées
              </span>
            </div>
            <p>
              Les résultats sont classés selon leur compatibilité avec
              votre profil.
            </p>
          </div>

          {data.recommendations.length === 0 ? (
            <div className="recommendations-message">
              Aucune formation disponible pour le moment.
            </div>
          ) : (
            <div className="recommendations-list">
              {data.recommendations.map((item, index) => (
                <article
                  className="recommendation-card"
                  key={`${item.formation.name}-${index}`}
                >
                  <div className="recommendation-top">
                    <div>
                      <span className="recommendation-rank">
                        RECOMMANDATION {index + 1}
                      </span>
                      <h2>{item.formation.name}</h2>
                      <p className="recommendation-institution">
                        {item.formation.institution} · {item.formation.city}
                      </p>
                    </div>

                    <div className="recommendation-score">
                      <strong>{item.score}</strong>
                      <span>/ 100</span>
                      <small>Compatibilité</small>
                    </div>
                  </div>

                  <div className="score-track">
                    <div
                      className="score-fill"
                      style={{
                        width: `${Math.max(0, Math.min(100, item.score))}%`,
                      }}
                    />
                  </div>

                  <div className={`eligibility-status ${item.eligibility}`}>
                    {getEligibilityLabel(item.eligibility)}
                  </div>

                  {item.reasons.length > 0 && (
                    <div className="recommendation-section">
                      <h3>Pourquoi cette formation ?</h3>
                      <ul>
                        {item.reasons.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.warnings.length > 0 && (
                    <div className="recommendation-warnings">
                      <h3>Points à vérifier</h3>
                      <ul>
                        {item.warnings.map((warning, i) => (
                          <li key={i}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="recommendation-details">
                    <span>
                      Mode d’admission : {item.formation.admission_method}
                    </span>

                    {item.formation.minimum_average !== null && (
                      <span>
                        Moyenne minimale indiquée :{' '}
                        {item.formation.minimum_average}/20
                      </span>
                    )}

                    {item.formation.last_verified && (
                      <span>
                        Dernière vérification : {item.formation.last_verified}
                      </span>
                    )}
                  </div>

                  {item.formation.official_url && (
                    <a
                      className="official-link"
                      href={item.formation.official_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Consulter la source officielle ↗
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}

          <p className="recommendations-disclaimer">
            Important : le score représente une compatibilité indicative
            entre votre profil et les critères disponibles. Ce n’est pas
            une probabilité d’admission ni une garantie d’acceptation.
            Vérifiez toujours les conditions auprès de l’établissement.
          </p>
        </>
      )}
    </div>
  )
}

export default Recommendations
