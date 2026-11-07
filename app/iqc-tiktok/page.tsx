'use client';

import AppShell from '@/components/AppShell';
import IqcTiktokTool from '@/components/tools/IqcTiktokTool';
import BackButton from '@/components/BackButton';

export default function IqcTiktokPage() {
  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <BackButton />
        </div>
        <IqcTiktokTool />
      </div>
    </AppShell>
  );
}
