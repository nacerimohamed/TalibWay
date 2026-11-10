
import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'

type Language = 'fr' | 'ar'

function Home() {
  const [language, setLanguage] = useState<Language>('fr')
  const isArabic = language === 'ar'

  const content = {
    fr: {
      home: 'Accueil',
      formations: 'Formations',
      how: 'Comment ça marche',
      about: 'À propos',
      login: 'Connexion',
      start: 'Créer un compte',
      tag: 'TON AVENIR, TON PARCOURS',
      title: 'Construis ton avenir avec le bon choix.',
      description: 'Découvre les formations qui correspondent à ton profil, tes résultats et tes ambitions. TalibWay t’accompagne dans ton orientation après le Bac ou le Bac+2.',
      discover: 'Découvrir la plateforme',
      learn: 'Comment ça marche ?',
      students: 'Un parcours adapté à ton profil',
      recommendations: 'Des recommandations personnalisées',
      opportunities: 'Des opportunités partout au Maroc',
      trusted: 'Une orientation plus claire, un avenir mieux préparé.',
      sectionTag: 'POURQUOI TALIBWAY ?',
      sectionTitle: 'L’orientation devient plus simple.',
      sectionDescription: 'Ne choisis plus au hasard. Découvre les possibilités qui correspondent réellement à ton parcours.',
      features: [
        { icon: '01', title: 'Analyse de ton profil', description: 'Renseigne ton parcours scolaire, tes moyennes, tes diplômes et tes centres d’intérêt.' },
        { icon: '02', title: 'Recommandations intelligentes', description: 'Découvre les formations compatibles avec ton profil et comprends pourquoi elles te sont proposées.' },
        { icon: '03', title: 'Décision éclairée', description: 'Compare les possibilités, consulte les conditions et prépare la prochaine étape de ton parcours.' },
      ],
      formationTag: 'EXPLORE TON AVENIR',
      formationTitle: 'Des domaines pour construire ton futur.',
      formationDescription: 'Explore quelques domaines de formation et découvre les parcours qui pourraient te correspondre.',
      fields: [
        ['⌘', 'Informatique', 'Développement, logiciels et systèmes numériques.'],
        ['✦', 'Data & Intelligence Artificielle', 'Données, analyse et technologies intelligentes.'],
        ['◇', 'Génie logiciel', 'Conception et développement d’applications.'],
      ],
      ctaTitle: 'Prêt à trouver ta prochaine étape ?',
      ctaDescription: 'Commence par renseigner ton profil et découvre les possibilités qui s’offrent à toi.',
      ctaButton: 'Commencer mon orientation',
      footer: 'Ton orientation, notre priorité.',
      rights: 'Tous droits réservés.',
    },
    ar: {
      home: 'الرئيسية',
      formations: 'التكوينات',
      how: 'كيف تعمل المنصة',
      about: 'من نحن',
      login: 'تسجيل الدخول',
      start: 'إنشاء حساب',
      tag: 'مستقبلك، اختيارك',
      title: 'ابنِ مستقبلك بالاختيار الصحيح.',
      description: 'اكتشف التكوينات المناسبة لمسارك الدراسي ونتائجك وطموحاتك. ترافقك TalibWay في التوجيه بعد البكالوريا أو Bac+2.',
      discover: 'اكتشف المنصة',
      learn: 'كيف تعمل المنصة؟',
      students: 'مسار يناسب ملفك الدراسي',
      recommendations: 'اقتراحات مخصصة لك',
      opportunities: 'فرص دراسية في جميع أنحاء المغرب',
      trusted: 'توجيه أوضح، ومستقبل أفضل استعداداً.',
      sectionTag: 'لماذا TALIBWAY؟',
      sectionTitle: 'التوجيه أصبح أسهل.',
      sectionDescription: 'لا تختر عشوائياً. اكتشف الإمكانيات التي تناسب مسارك الدراسي فعلاً.',
      features: [
        { icon: '01', title: 'تحليل ملفك الدراسي', description: 'أدخل مسارك الدراسي ومعدلاتك وشهاداتك واهتماماتك.' },
        { icon: '02', title: 'اقتراحات ذكية', description: 'اكتشف التكوينات المناسبة لملفك وافهم أسباب اقتراحها عليك.' },
        { icon: '03', title: 'اتخاذ قرار أفضل', description: 'قارن بين الاختيارات واطلع على الشروط وحضّر خطوتك القادمة.' },
      ],
      formationTag: 'اكتشف مستقبلك',
      formationTitle: 'مجالات تساعدك على بناء مستقبلك.',
      formationDescription: 'استكشف بعض مجالات التكوين واكتشف المسارات التي قد تناسبك.',
      fields: [
        ['⌘', 'المعلوميات', 'التطوير والبرمجيات والأنظمة الرقمية.'],
        ['✦', 'البيانات والذكاء الاصطناعي', 'البيانات والتحليل والتقنيات الذكية.'],
        ['◇', 'هندسة البرمجيات', 'تصميم وتطوير التطبيقات.'],
      ],
      ctaTitle: 'هل أنت مستعد لاكتشاف خطوتك القادمة؟',
      ctaDescription: 'ابدأ بإدخال ملفك الدراسي واكتشف الفرص المتاحة أمامك.',
      ctaButton: 'ابدأ التوجيه',
      footer: 'توجيهك أولويتنا.',
      rights: 'جميع الحقوق محفوظة.',
    },
  }

  const t = content[language]

  return (
    <div className={`site ${isArabic ? 'rtl' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">T</span>
          <span>Talib<span className="brand-highlight">Way</span></span>
        </a>

        <nav className="nav-links">
          <a href="#home">{t.home}</a>
          <a href="#formations">{t.formations}</a>
          <a href="#how">{t.how}</a>
          <a href="#about">{t.about}</a>
        </nav>

        <div className="nav-actions">
          <button
            className="language-button"
            onClick={() => setLanguage(isArabic ? 'fr' : 'ar')}
            type="button"
          >
            {isArabic ? 'FR' : 'عربي'}
          </button>

          <Link className="login-link" to="/login">{t.login}</Link>
          <Link className="button button-small" to="/register">{t.start}</Link>
        </div>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              {t.tag}
            </div>

            <h1>{t.title}</h1>
            <p className="hero-description">{t.description}</p>

            <div className="hero-buttons">
              <Link className="button" to="/register">
                {t.discover} <span>↗</span>
              </Link>
              <a className="button button-outline" href="#how">{t.learn}</a>
            </div>

            <div className="hero-points">
              <div><span>✓</span>{t.students}</div>
              <div><span>✓</span>{t.recommendations}</div>
              <div><span>✓</span>{t.opportunities}</div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow" />
            <div className="visual-card main-visual-card">
              <div className="visual-top">
                <span className="visual-label">TALIBWAY / ORIENTATION</span>
                <span className="visual-status">● ACTIVE</span>
              </div>

              <div className="visual-heading">
                <span className="visual-avatar">T</span>
                <div>
                  <strong>{isArabic ? 'ملفك الدراسي' : 'Ton profil étudiant'}</strong>
                  <small>{isArabic ? 'اكتشف مسارك القادم' : 'Découvre ton prochain parcours'}</small>
                </div>
              </div>

              <div className="visual-progress">
                <div className="progress-heading">
                  <span>{isArabic ? 'تحليل الملف' : 'Analyse du profil'}</span>
                  <strong>85%</strong>
                </div>
                <div className="progress-track"><span /></div>
              </div>

              <div className="visual-result">
                <span className="result-icon">✦</span>
                <div>
                  <small>{isArabic ? 'اقتراح مناسب' : 'Formation suggérée'}</small>
                  <strong>{isArabic ? 'هندسة البرمجيات' : 'Génie logiciel'}</strong>
                </div>
                <span className="result-arrow">↗</span>
              </div>

              <div className="visual-result secondary-result">
                <span className="result-icon">⌘</span>
                <div>
                  <small>{isArabic ? 'مجال آخر' : 'Autre domaine'}</small>
                  <strong>{isArabic ? 'المعلوميات' : 'Informatique'}</strong>
                </div>
                <span className="result-arrow">↗</span>
              </div>
            </div>

            <div className="floating-note">
              <span>✦</span>
              <div>
                <strong>{isArabic ? 'اختيارات أوضح' : 'Meilleurs choix'}</strong>
                <small>{isArabic ? 'حسب ملفك الدراسي' : 'Selon ton profil'}</small>
              </div>
            </div>

            <div className="visual-decoration decoration-one" />
            <div className="visual-decoration decoration-two" />
          </div>
        </section>

        <section className="trust-strip">
          <p>{t.trusted}</p>
        </section>

        <section className="features-section section" id="how">
          <div className="section-heading">
            <span className="section-tag">{t.sectionTag}</span>
            <h2>{t.sectionTitle}</h2>
            <p>{t.sectionDescription}</p>
          </div>

          <div className="features-grid">
            {t.features.map((feature) => (
              <article className="feature-card" key={feature.icon}>
                <span className="feature-number">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <span className="feature-arrow">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section className="fields-section section" id="formations">
          <div className="section-heading">
            <span className="section-tag">{t.formationTag}</span>
            <h2>{t.formationTitle}</h2>
            <p>{t.formationDescription}</p>
          </div>

          <div className="fields-grid">
            {t.fields.map(([icon, title, description]) => (
              <article className="field-card" key={title}>
                <span className="field-icon">{icon}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <a href="#start">
                  {isArabic ? 'اكتشف المزيد' : 'Découvrir'} <span>↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-section" id="start">
          <div className="cta-content">
            <span className="section-tag">
              {isArabic ? 'خطوتك القادمة تبدأ هنا' : 'TON AVENIR COMMENCE ICI'}
            </span>
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaDescription}</p>
            <Link className="button button-light" to="/register">
              {t.ctaButton} <span>↗</span>
            </Link>
          </div>
          <div className="cta-shape">T</div>
        </section>
      </main>

      <footer className="footer" id="about">
        <a className="brand" href="#home">
          <span className="brand-icon">T</span>
          <span>Talib<span className="brand-highlight">Way</span></span>
        </a>
        <p>{t.footer}</p>
        <small>© 2026 TalibWay. {t.rights}</small>
      </footer>
    </div>
  )
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected pages */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App

