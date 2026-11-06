'use client';

import AppShell from '@/components/AppShell';
import BackButton from '@/components/BackButton';

export default function FakeCallPage() {
  return (
    <AppShell>
      <div className="w-full max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <BackButton />
        </div>
        <div className="bg-red-500 text-white p-10 rounded-2xl text-center">
          <h1 className="text-2xl font-bold">TEST: Halaman Fake Call Muncul!</h1>
        </div>
      </div>
    </AppShell>
  );
}
