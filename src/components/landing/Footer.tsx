import Link from "next/link";

import { Container } from "@/components/landing/Container";
import { Logo } from "@/components/landing/Logo";
import { NewLogo } from "@/components/landing/NewLogo";
import { NavLink } from "@/components/landing/NavLink";
import { Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-50">
      <Container>
        <div className="py-16">
          <NewLogo className="mx-auto h-7 w-auto" />
          <nav className="mt-10 text-sm" aria-label="quick links">
            <div className="-my-1 flex justify-center gap-x-6">
              <NavLink href="#features">Fitur</NavLink>
              <NavLink href="#testimonials">Testimoni</NavLink>
              <NavLink href="#pricing">Harga</NavLink>
            </div>
          </nav>
        </div>
        <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6">
            <Link
              href="https://twitter.com"
              className="group"
              aria-label="PasienPlus on Twitter"
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 2.8 9.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.093 4.093 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 18.407a11.615 11.615 0 0 0 6.29 1.84" />
              </svg>
            </Link>
            <Link
              href="https://instagram.com"
              className="group"
              aria-label="PasienPlus on Instagram"
            >
              <Instagram className="h-6 w-6 text-slate-500 group-hover:text-slate-700" />
            </Link>
            {/* whatsapp */}
            <Link
              href="https://wa.me/6282141017065"
              className="group"
              aria-label="PasienPlus on Whatsapp"
            >
              <Mail className="h-6 w-6 text-slate-500 group-hover:text-slate-700" />
            </Link>


          </div>
          <p className="mt-6 text-sm text-slate-500 sm:mt-0">
            Copyright &copy; {new Date().getFullYear()} PasienPlus. All rights
            reserved.

            <br />
            Jl. Ciliwung no. 125a, Blitar, Jawa Timur, Indonesia
          </p>

        </div>
      </Container>
    </footer>
  );
}
