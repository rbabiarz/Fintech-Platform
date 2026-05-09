export default function ComponentName() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <div className="max-w-md w-full rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-2">Mockup Preview Ready</h1>
        <p className="text-sm text-muted-foreground">
          The preview server is rendering correctly. Add more files under
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">
            src/components/mockups
          </code>
          and open them via
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">
            /preview/YourComponent
          </code>
          .
        </p>
      </div>
    </div>
  );
}
