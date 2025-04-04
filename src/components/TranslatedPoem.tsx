export default function TranslatedPoem({ translatedContent }: { translatedContent: string }) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">अनुवादित कविता (Translated Poem)</h2>
        <div
          className="prose prose-lg"
          dangerouslySetInnerHTML={{ __html: translatedContent }}
        />
      </div>
    );
  }
  