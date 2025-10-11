import { GanttChart } from 'lucide-react';

export function ComingSoon({ pageName }: { pageName: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full min-h-[calc(100vh-10rem)]">
      <div className="p-8 rounded-full bg-primary/10 border border-primary/20 mb-6">
        <GanttChart className="w-16 h-16 text-primary" />
      </div>
      <h1 className="text-4xl font-headline font-bold text-foreground">
        Coming Soon
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        The "{pageName}" feature is under construction. We're working hard to
        bring you this exciting new tool. Stay tuned!
      </p>
    </div>
  );
}
