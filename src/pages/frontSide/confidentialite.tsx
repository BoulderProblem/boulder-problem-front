import { useLayoutEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

function Confidentialité() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>Boulder problem</title>
          <meta name="description" content="politique de confidentialité" />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-primary-600 text-white py-4">
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
                Politique de Confidentialité
              </h1>
            </div>
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-1xl font-semibold mb-6">
                Dernière mise à jour : 01/01/2025
              </h2>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  1. Collecte des informations
                </h3>
                <p className="text-gray-700">
                  Nous collectons les types d'informations suivants lorsque vous
                  utilisez "Boulder Problem" :
                </p>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>
                    <strong>Informations personnelles</strong> : Lorsque vous
                    vous inscrivez à l'application, vous nous fournissez des
                    informations personnelles telles que votre nom, votre
                    adresse e-mail, votre photo de profil, ainsi que des détails
                    sur vos préférences d'escalade.
                  </li>
                  <li>
                    <strong>Informations de localisation</strong> : Si vous
                    choisissez d'activer la fonction de géolocalisation, nous
                    collectons des informations sur votre position pour vous
                    permettre de trouver des sites d'escalade et de participer à
                    des événements locaux.
                  </li>
                  <li>
                    <strong>Données d'utilisation</strong> : Nous collectons des
                    informations sur la manière dont vous utilisez
                    l'application, y compris les pages que vous consultez, la
                    durée de votre utilisation, les interactions avec d'autres
                    utilisateurs, les publications que vous aimez ou commentez,
                    ainsi que les informations techniques de votre appareil.
                  </li>
                  <li>
                    <strong>Contenu généré par l'utilisateur</strong> : Les
                    photos, vidéos et autres contenus que vous publiez sur
                    l'application sont également collectés et peuvent être
                    partagés avec d'autres utilisateurs de l'application.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  2. Utilisation des informations
                </h3>
                <p className="text-gray-700">
                  Les informations que nous collectons sont utilisées pour :
                </p>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>
                    <strong>Fournir et améliorer nos services</strong> :
                    Personnaliser votre expérience, recommander des partenaires
                    d'escalade, des sites et des événements locaux.
                  </li>
                  <li>
                    <strong>Communiquer avec vous</strong> : Vous envoyer des
                    notifications sur les mises à jour, événements, et autres
                    informations pertinentes.
                  </li>
                  <li>
                    <strong>Sécuriser l'application</strong> : Détecter et
                    prévenir les activités suspectes ou frauduleuses.
                  </li>
                  <li>
                    <strong>Respecter nos obligations légales</strong> :
                    Utiliser ou divulguer vos informations pour respecter les
                    lois applicables.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  3. Partage des informations
                </h3>
                <p className="text-gray-700">
                  Nous nous engageons à ne pas vendre vos informations
                  personnelles à des tiers. Cependant, nous pouvons partager vos
                  données dans les situations suivantes :
                </p>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>
                    <strong>Avec d'autres utilisateurs</strong> : Les
                    informations que vous publiez peuvent être visibles par
                    d'autres utilisateurs de l'application.
                  </li>
                  <li>
                    <strong>Avec des prestataires de services</strong> : Pour
                    nous aider à gérer et améliorer l'application.
                  </li>
                  <li>
                    <strong>Pour des raisons légales</strong> : Si nécessaire
                    pour se conformer aux lois ou protéger nos droits.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  4. Sécurité des données
                </h3>
                <p className="text-gray-700">
                  Nous mettons en place des mesures de sécurité raisonnables
                  pour protéger vos données personnelles contre la perte,
                  l'abus, l'accès non autorisé ou la divulgation.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">5. Vos droits</h3>
                <p className="text-gray-700">
                  En fonction de votre lieu de résidence, vous pouvez avoir
                  certains droits concernant vos données personnelles, notamment
                  :
                </p>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>
                    <strong>Accès et rectification</strong> : Demander une copie
                    de vos informations et les corriger si nécessaire.
                  </li>
                  <li>
                    <strong>Suppression</strong> : Demander la suppression de
                    vos données personnelles.
                  </li>
                  <li>
                    <strong>Portabilité des données</strong> : Demander le
                    transfert de vos données à un autre fournisseur de services.
                  </li>
                  <li>
                    <strong>Opposition au traitement</strong> : Vous opposer à
                    certains types de traitement de vos données.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">6. Cookies</h3>
                <p className="text-gray-700">
                  Nous utilisons des cookies pour améliorer votre expérience.
                  Vous pouvez configurer votre appareil pour refuser les
                  cookies, mais cela pourrait affecter certaines
                  fonctionnalités.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  7. Modifications de cette politique
                </h3>
                <p className="text-gray-700">
                  Nous nous réservons le droit de modifier cette politique de
                  confidentialité. Toute mise à jour sera publiée ici avec la
                  date de mise à jour.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">8. Contact</h3>
                <p className="text-gray-700">
                  Si vous avez des questions, veuillez nous contacter à :
                  <a
                    href="mailto:contact@boulderproblem.com"
                    className="text-blue-600 hover:underline"
                  >
                    contact@boulderproblem.com
                  </a>
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

export default Confidentialité;
