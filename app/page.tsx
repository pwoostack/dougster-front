import Link from "next/link";
import Image from "next/image";

async function getArticles() {
  const res = await fetch("http://127.0.0.1:1337/api/articles?populate=*", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Impossible de récupérer les articles");
  }

  return res.json();
}

function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
}

export default async function Home() {
  const { data: articles } = await getArticles();
  const STRAPI_URL = "http://127.0.0.1:1337";

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            🐕 Le Blog de Dougster
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Des articles générés par IA, illustrés par IA, codés par un humain !
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article: any) => {
            
            // CORRECTION ICI : Accès direct à l'URL
            const imageUrl = article.Image_de_couverture?.url 
              ? STRAPI_URL + article.Image_de_couverture.url 
              : null;

            return (
              <div
                key={article.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col"
              >
                <div className="relative h-48 w-full bg-gray-200">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={article.Titre}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Pas d'image 📷
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {article.Titre}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3 text-sm">
                    {stripHtml(article.contenu).substring(0, 100)}...
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <Link 
                      href={`/article/${article.Slug}`}
                      className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors text-sm"
                    >
                      Lire l'article 
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}