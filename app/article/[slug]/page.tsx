import Link from "next/link";

// 1. Fonction pour récupérer UN seul article via son Slug
async function getArticle(slug: string) {
  const res = await fetch(
    `http://127.0.0.1:1337/api/articles?filters[Slug][$eq]=${slug}`,
    { cache: "no-store" }
  );
  
  const data = await res.json();
  
  // Strapi renvoie toujours une liste, on prend le premier élément
  return data.data[0];
}

// 2. Le composant de la page
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Dans les nouvelles versions de Next.js, il faut attendre les paramètres
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Oups ! Article introuvable 😕</h1>
        <Link href="/" className="text-blue-500 hover:underline">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Bouton retour */}
      <div className="max-w-3xl mx-auto pt-10 px-6">
        <Link href="/" className="text-gray-500 hover:text-blue-600 transition flex items-center gap-2 mb-8">
          ← Retour aux articles
        </Link>

        {/* En-tête de l'article */}
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            {article.Titre}
          </h1>
          <div className="text-sm text-gray-500 border-l-4 border-blue-500 pl-4 py-1">
            Publié automatiquement par Dougster AI 🤖
          </div>
        </header>

        {/* CONTENU DE L'ARTICLE */}
        {/* C'est ici que la magie opère pour lire le HTML de l'IA */}
        <article 
          className="prose prose-lg max-w-none prose-blue text-gray-700"
          dangerouslySetInnerHTML={{ __html: article.contenu }}
        />
      </div>
    </main>
  );
}