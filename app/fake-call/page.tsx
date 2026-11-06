'use client';

import AppShell from '@/components/AppShell';
import FakeCallTool from '@/components/tools/FakeCallTool';
import BackButton from '@/components/BackButton';

export default function FakeCallPage() {
  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <BackButton />
        </div>
        <FakeCallTool />
      </div>
    </AppShell>
  );
}
