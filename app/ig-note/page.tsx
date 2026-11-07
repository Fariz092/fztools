'use client';

import AppShell from '@/components/AppShell';
import IgNoteTool from '@/components/tools/IgNoteTool';
import BackButton from '@/components/BackButton';

export default function IgNotePage() {
  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <BackButton />
        </div>
        <IgNoteTool />
      </div>
    </AppShell>
  );
}
