export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-white font-bold mb-2">TOMOBILTI</p>
            <p className="text-xs">Le marché automobile algérien</p>
          </div>
          <div>
            <p className="text-white font-medium mb-2">Navigation</p>
            <div className="space-y-1 text-xs">
              <a href="/" className="block hover:text-white">Accueil</a>
              <a href="/deposer" className="block hover:text-white">Déposer une annonce</a>
              <a href="/favoris" className="block hover:text-white">Favoris</a>
            </div>
          </div>
          <div>
            <p className="text-white font-medium mb-2">Légal</p>
            <div className="space-y-1 text-xs">
              <a href="#" className="block hover:text-white">Mentions légales</a>
              <a href="#" className="block hover:text-white">Confidentialité</a>
              <a href="#" className="block hover:text-white">CGU</a>
            </div>
          </div>
          <div>
            <p className="text-white font-medium mb-2">Contact</p>
            <div className="space-y-1 text-xs">
              <a href="#" className="block hover:text-white">Support</a>
              <a href="#" className="block hover:text-white">Publicité</a>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-800 text-center text-xs">
          &copy; {new Date().getFullYear()} TOMOBILTI. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
