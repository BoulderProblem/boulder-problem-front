import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

function Conditions() {
  const navigate = useNavigate();

  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>Boulder problem</title>
          <meta name="description" content="Conditions d'utilisation" />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
          {/* Header */}
          <header className="bg-primary-600 text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold">
                <button
                  onClick={() => navigate(-1)}
                  className="text-white mr-4 p-2 rounded-full hover:bg-primary-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 12H5m7 7l-7-7 7-7"
                    />
                  </svg>
                </button>
                Boulder Problem
              </h1>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto mb-10">
              <h1 className="text-3xl font-bold">
                Politique de Confidentialité de Boulder Problem
              </h1>
            </div>
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-1xl font-semibold mb-6">
                Dernière mise à jour : 01/01/2025
              </h2>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-base text-gray-700">
                  Les présentes conditions d'utilisation ("Conditions")
                  régissent votre utilisation de l'application "Boulder Problem"
                  (l'Application), un réseau social destiné aux passionnés
                  d'escalade. En téléchargeant, en accédant ou en utilisant
                  l'Application, vous acceptez d'être lié par ces Conditions. Si
                  vous n'acceptez pas ces Conditions, veuillez ne pas utiliser
                  l'Application.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  2. Description de l'Application
                </h2>
                <p className="text-base text-gray-700">
                  "Boulder Problem" est une plateforme sociale dédiée à
                  l'escalade, permettant aux utilisateurs de partager leurs
                  expériences, de se connecter avec d'autres grimpeurs, de
                  suivre des défis d'escalade, de partager des photos et vidéos,
                  et de discuter des techniques et événements liés à l'escalade.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  3. Inscription et Compte Utilisateur
                </h2>
                <h3 className="text-lg font-semibold mb-2">
                  3.1 Création de compte
                </h3>
                <p className="text-base text-gray-700">
                  Pour utiliser l'Application, vous devez créer un compte en
                  fournissant des informations exactes, à jour et complètes.
                  Vous êtes responsable de la confidentialité de votre mot de
                  passe et de toutes les activités effectuées sous votre compte.
                </p>

                <h3 className="text-lg font-semibold mb-2">
                  3.2 Responsabilité de l'utilisateur
                </h3>
                <p className="text-base text-gray-700">
                  Vous vous engagez à ne pas partager votre compte avec des
                  tiers. Vous êtes responsable de toute activité effectuée par
                  une personne ayant accès à votre compte, qu'il s'agisse d'un
                  usage autorisé ou non.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  4. Utilisation de l'Application
                </h2>
                <h3 className="text-lg font-semibold mb-2">
                  4.1 Respect des lois
                </h3>
                <p className="text-base text-gray-700">
                  Vous vous engagez à utiliser l'Application conformément à
                  toutes les lois, règles et règlements applicables, notamment
                  en ce qui concerne la sécurité en escalade.
                </p>

                <h3 className="text-lg font-semibold mb-2">
                  4.2 Comportement respectueux
                </h3>
                <p className="text-base text-gray-700">
                  Vous acceptez de ne pas utiliser l'Application pour diffuser
                  de contenus ou comportements inappropriés, y compris, mais
                  sans s'y limiter, du harcèlement, des discours haineux, de la
                  désinformation ou des contenus violents. Toute infraction
                  pourra entraîner la suspension ou la suppression de votre
                  compte.
                </p>

                <h3 className="text-lg font-semibold mb-2">
                  4.3 Propriété intellectuelle
                </h3>
                <p className="text-base text-gray-700">
                  Tout le contenu disponible sur l'Application, y compris, mais
                  sans s'y limiter, les logos, les graphismes, les vidéos, les
                  photos, et autres matériaux, est la propriété de "Boulder
                  Problem" ou de ses partenaires. Vous vous engagez à ne pas
                  utiliser, reproduire ou distribuer ces contenus sans
                  autorisation.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  5. Partage de contenu
                </h2>
                <h3 className="text-lg font-semibold mb-2">
                  5.1 Propriété du contenu
                </h3>
                <p className="text-base text-gray-700">
                  En publiant des photos, vidéos, commentaires ou autres
                  contenus sur l'Application, vous conservez la propriété des
                  droits d'auteur sur ces éléments. Toutefois, vous accordez à
                  "Boulder Problem" une licence mondiale, non exclusive,
                  gratuite et transférable pour utiliser, reproduire, distribuer
                  et afficher votre contenu dans le cadre des fonctionnalités de
                  l'Application.
                </p>

                <h3 className="text-lg font-semibold mb-2">
                  5.2 Responsabilité du contenu
                </h3>
                <p className="text-base text-gray-700">
                  Vous êtes entièrement responsable du contenu que vous publiez
                  sur l'Application. Vous vous engagez à ne pas publier de
                  contenu protégé par des droits d'auteur, des marques déposées
                  ou tout autre droit de propriété intellectuelle sans
                  l'autorisation appropriée.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">6. Sécurité</h2>
                <h3 className="text-lg font-semibold mb-2">
                  6.1 Escalade responsable
                </h3>
                <p className="text-base text-gray-700">
                  L'Application ne remplace en aucun cas la formation
                  professionnelle ou l'encadrement sur les sites d'escalade.
                  Vous êtes responsable de votre sécurité et devez toujours
                  respecter les bonnes pratiques d'escalade.
                </p>

                <h3 className="text-lg font-semibold mb-2">
                  6.2 Données personnelles
                </h3>
                <p className="text-base text-gray-700">
                  Nous nous engageons à protéger vos données personnelles
                  conformément à notre Politique de Confidentialité. Vous
                  acceptez que certaines informations personnelles soient
                  collectées et traitées comme décrit dans cette politique.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  7. Limitations de responsabilité
                </h2>
                <p className="text-base text-gray-700">
                  "Boulder Problem" ne pourra être tenu responsable des pertes
                  ou dommages directs, indirects, spéciaux, accessoires ou
                  consécutifs découlant de l'utilisation de l'Application, de la
                  participation à des défis d'escalade ou de l'accès à des liens
                  externes fournis par l'Application.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  8. Modifications de l'Application et des Conditions
                </h2>
                <p className="text-base text-gray-700">
                  "Boulder Problem" se réserve le droit de modifier, suspendre
                  ou interrompre tout ou partie de l'Application, ainsi que de
                  modifier ces Conditions à tout moment, sans préavis. Les
                  modifications seront effectives dès leur publication dans
                  l'Application. Il vous incombe de vérifier régulièrement les
                  Conditions.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">9. Résiliation</h2>
                <p className="text-base text-gray-700">
                  Nous nous réservons le droit de suspendre ou de résilier votre
                  compte si vous violez ces Conditions. Vous pouvez également
                  résilier votre compte à tout moment en nous contactant via
                  l'Application.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">
                  10. Droit applicable
                </h2>
                <p className="text-base text-gray-700">
                  Ces Conditions sont régies par la législation du pays où
                  "Boulder Problem" est domicilié. Tout litige relatif à
                  l'utilisation de l'Application sera soumis à la juridiction
                  exclusive des tribunaux compétents.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-4">11. Contact</h2>
                <p className="text-base text-gray-700">
                  Pour toute question relative à ces Conditions ou à
                  l'Application, vous pouvez nous contacter à l'adresse suivante
                  :{' '}
                  <a
                    href="mailto:contact@boulderproblem.com"
                    className="text-blue-500 hover:underline"
                  >
                    contact@boulderproblem.com
                  </a>
                  .
                </p>
              </section>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-primary-600 text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p>&copy; 2025 Boulder Problem. Tous droits réservés.</p>
            </div>
          </footer>
        </div>
      </div>
    </HelmetProvider>
  );
}

export default Conditions;
