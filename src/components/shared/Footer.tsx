export function Footer() {
  return (
    <footer className="py-8 mt-16 border-t">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Help me not getting high on my own supply.</p>
          <div className="space-x-4">
            <a
              href="mailto:contact@hey-oko.com"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              contact@hey-oko.com
            </a>
            <a
              href="https://youtube.com/@hey-oko"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 