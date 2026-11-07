'use client';

import AppShell from '@/components/AppShell';
import LinkExpanderTool from '@/components/tools/LinkExpanderTool';
import BackButton from '@/components/BackButton';

export default function LinkExpanderPage() {
  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <BackButton />
        </div>
        <LinkExpanderTool />
      </div>
    </AppShell>
  );
}
