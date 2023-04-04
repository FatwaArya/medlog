import type { PropsWithChildren } from "react";

export default function ContentArea({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col md:pl-64">
      <main className="flex-1 bg-slate-50">
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 ">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
