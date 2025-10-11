import { FaceAnalysisClient } from './components/face-analysis-client';

export default function FaceAnalysisPage() {
  return (
    <div className="container mx-auto max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
          Face Analysis Tool
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Upload your photo and let our AI provide a personalized style
          analysis.
        </p>
      </div>
      <FaceAnalysisClient />
    </div>
  );
}
