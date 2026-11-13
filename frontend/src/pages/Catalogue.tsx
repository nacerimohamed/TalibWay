
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api'
import './Catalogue.css'

interface Domain {
  id: string
  name: string
  filieres: string[]
}

interface CatalogueResponse {
  message: string
  total_domains: number
  total_filières: number
  domains: Domain[]
}

function Catalogue() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [search, setSearch] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadCatalogue() {
      try {
        const data: CatalogueResponse = await apiRequest('/catalogue')
        setDomains(data.domains)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de charger le catalogue.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadCatalogue()
  }, [])

  const totalFilieres = domains.reduce(
    (total, domain) => total + domain.filieres.length,
    0
  )


  const filteredDomains = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()

    return domains
      .filter(domain =>
        selectedDomain === 'all' || domain.id === selectedDomain
      )
      .map(domain => {
        const domainMatches = domain.name
          .toLocaleLowerCase()
          .includes(query)

        return {
          ...domain,
          filieres: !query || domainMatches
            ? domain.filieres
            : domain.filieres.filter(filiere =>
                filiere.toLocaleLowerCase().includes(query)
              ),
        }
      })
      .filter(domain => {
        if (!query) return true

        return (
          domain.name.toLocaleLowerCase().includes(query) ||
          domain.filieres.length > 0
        )
      })
  }, [domains, search, selectedDomain])


  return (
    <div className="catalogue-page">
      <header className="catalogue-navbar">
        <Link to="/" className="catalogue-brand">
          <span className="catalogue-brand-icon">T</span>
          <span>Talib<span>Way</span></span>
        </Link>

        <nav>
          <Link to="/">Accueil</Link>
          <Link to="/login">Connexion</Link>
          <Link to="/register" className="catalogue-nav-button">
            Créer un compte
          </Link>
        </nav>
      </header>

      <main>
        <section className="catalogue-hero">
          <div className="catalogue-hero-content">
            <span className="catalogue-eyebrow">
              EXPLORER LES POSSIBILITÉS
            </span>

            <h1>
              Trouve le domaine qui correspond à ton <span>avenir.</span>
            </h1>

            <p>
              Explore les différents domaines d'études et découvre les
              filières disponibles dans le catalogue TalibWay.
            </p>

            <div className="catalogue-stats">
              <div>
                <strong>{domains.length || '—'}</strong>
                <span>Domaines</span>
              </div>
              <div>
                <strong>{totalFilieres || '—'}</strong>
                <span>Filières</span>
              </div>
              <div>
                <strong>Maroc</strong>
                <span>Orientation</span>
              </div>
            </div>
          </div>

          <div className="catalogue-hero-decoration">
            <div className="catalogue-decoration-circle">T</div>
            <div className="catalogue-decoration-card">
              <span>TON PARCOURS</span>
              <strong>Un choix. Plusieurs possibilités.</strong>
              <small>Découvre et explore.</small>
            </div>
          </div>
        </section>

        <section className="catalogue-content">
          <div className="catalogue-section-heading">
            <div>
              <span className="catalogue-eyebrow">CATALOGUE DES ÉTUDES</span>
              <h2>Tous les domaines de formation</h2>
              <p>Recherche une filière ou explore les domaines disponibles.</p>
            </div>
          </div>

          <div className="catalogue-search">
            <span className="catalogue-search-icon">⌕</span>
            <input
              type="search"
              placeholder="Rechercher une filière, un domaine..."
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} type="button">
                Effacer
              </button>
            )}
          </div>

          <div className="catalogue-layout">
            <aside className="catalogue-sidebar">
              <h3>Domaines d'études</h3>

              <button
                className={selectedDomain === 'all' ? 'active' : ''}
                onClick={() => setSelectedDomain('all')}
                type="button"
              >
                <span>Tous les domaines</span>
                <small>{domains.length}</small>
              </button>

              {domains.map(domain => (
                <button
                  key={domain.id}
                  className={selectedDomain === domain.id ? 'active' : ''}
                  onClick={() => setSelectedDomain(domain.id)}
                  type="button"
                >
                  <span>{domain.name}</span>
                  <small>{domain.filieres.length}</small>
                </button>
              ))}
            </aside>

            <div className="catalogue-results">
              {loading && (
                <div className="catalogue-message">
                  Chargement du catalogue...
                </div>
              )}

              {error && (
                <div className="catalogue-message catalogue-error">
                  {error}
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                  >
                    Réessayer
                  </button>
                </div>
              )}

              {!loading && !error && filteredDomains.length === 0 && (
                <div className="catalogue-message">
                  Aucun résultat trouvé pour cette recherche.
                </div>
              )}

              {!loading && !error && filteredDomains.map(domain => (
                <article className="catalogue-domain-card" key={domain.id}>
                  <div className="catalogue-domain-heading">
                    <div className="catalogue-domain-icon">
                      {domain.id === 'sante' ? '✚' :
                        domain.id === 'genie_civil' ? '⌂' :
                        domain.id === 'informatique' ? '⌘' :
                        domain.id === 'industrie' ? '⚙' :
                        domain.id === 'electricite' ? 'ϟ' :
                        domain.id === 'agriculture' ? '♧' :
                        domain.id === 'commerce' ? '◇' :
                        domain.id === 'education' ? '▤' : '✦'}
                    </div>

                    <div>
                      <h3>{domain.name}</h3>
                      <span>
                        {domain.filieres.length} filière(s)
                      </span>
                    </div>
                  </div>

                  <div className="catalogue-filiere-list">
                    {domain.filieres.map(filiere => (
                      <span className="catalogue-filiere" key={filiere}>
                        {filiere}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="catalogue-cta">
          <div>
            <span>TON AVENIR COMMENCE ICI</span>
            <h2>Tu ne sais pas quelle formation choisir ?</h2>
            <p>
              Crée ton profil et découvre les formations qui peuvent
              correspondre à ton parcours scolaire.
            </p>
          </div>

          <Link to="/register">Commencer mon orientation ↗</Link>
        </section>
      </main>

      <footer className="catalogue-footer">
        <Link to="/" className="catalogue-brand">
          <span className="catalogue-brand-icon">T</span>
          <span>Talib<span>Way</span></span>
        </Link>
        <p>Ton orientation, notre priorité.</p>
        <small>© 2026 TalibWay. Tous droits réservés.</small>
      </footer>
    </div>
  )
}

export default Catalogue

