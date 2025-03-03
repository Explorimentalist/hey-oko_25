export function Footer() {
  return (
    <footer className="py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-gray-600 mb-4">Do you need some supply?</h2>
          <div className="space-x-4">
            <a
              href="mailto:brianoko@gmail.com"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              brianoko@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/ngatye-brian-oko-64051b14/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-md text-gray-600 hover:text-black transition-colors"
            >
              My LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 