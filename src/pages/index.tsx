import {
  Users,
  Map,
  Calendar,
  MessageCircle,
  Mountain,
  Camera,
} from 'lucide-react';
import { Feature } from '@/components/Feature.tsx';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import background from '../assets/home-background.webp';

function App() {
  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>Boulder problem</title>
          <meta name="description" content="page d'accueil" />
          <meta
            http-equiv="Content-Security-Policy"
            content="script-src 'unsafe-eval'"
          />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
          {/* Hero Section */}
          <header className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={background}
                alt="Grimpeur en action"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>

            <div className="relative z-10 text-center px-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                ClimbConnect
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8">
                Connectez-vous avec la communauté des grimpeurs
              </p>
              <Link to={'/login'}>
                <button className="bg-primary-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-primary-700 transition-colors">
                  Rejoignez l'aventure
                </button>
              </Link>
            </div>
          </header>

          {/* Features Section */}
          <section className="py-20 px-4 max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Tout ce dont vous avez besoin pour votre passion
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Feature
                icon={Users}
                title="Trouvez des partenaires"
                description="Connectez-vous avec des grimpeurs de votre niveau dans votre région"
              />
              <Feature
                icon={Map}
                title="Spots de grimpe"
                description="Découvrez les meilleurs sites d'escalade et partagez vos spots favoris"
              />
              <Feature
                icon={Calendar}
                title="Événements"
                description="Organisez et participez à des sessions de grimpe et des compétitions"
              />
              <Feature
                icon={MessageCircle}
                title="Communauté active"
                description="Échangez des conseils et partagez votre expérience avec d'autres passionnés"
              />
              <Feature
                icon={Mountain}
                title="Suivi de progression"
                description="Enregistrez vos voies et suivez votre évolution"
              />
              <Feature
                icon={Camera}
                title="Partage de moments"
                description="Partagez vos plus beaux moments d'escalade en photos et vidéos"
              />
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-primary-600 py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Prêt à rejoindre la communauté ?
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Inscrivez-vous gratuitement et commencez à grimper avec des
                passionnés comme vous
              </p>
              <button className="bg-white text-primary-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors">
                Créer un compte
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-gray-400 py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white text-lg font-semibold mb-4">
                  ClimbConnect
                </h3>
                <p>La communauté des grimpeurs passionnés</p>
              </div>
              <div>
                <h4 className="text-white text-lg font-semibold mb-4">
                  Liens utiles
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      À propos
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white text-lg font-semibold mb-4">Légal</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Conditions d'utilisation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Politique de confidentialité
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white text-lg font-semibold mb-4">
                  Suivez-nous
                </h4>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    Facebook
                  </a>
                  <a href="#" className="hover:text-white transition-colors">
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </HelmetProvider>
  );
}

export default App;
