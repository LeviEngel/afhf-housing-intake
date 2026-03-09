"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HeaderProps {
  sections: {
    title: string;
    id: number;
    icon: React.ElementType;
    component: React.ReactNode;
  }[];
  activeSection: number;
  setActiveSection: (id: number) => void;
}

export default function Header({
  sections,
  activeSection,
  setActiveSection,
}: HeaderProps) {
  const activeIndex = sections.findIndex((s) => s.id === activeSection);

  return (
    <Card className="items-center bg-[var(--primary-background)] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-center gap-0 text-white w-full relative max-md:flex-col max-2xl:gap-6">
        <Link
          href="https://afhf88.org/"
          className="rounded-full overflow-hidden absolute left-0 top-0 px-[21px] max-2xl:static max-2xl:self-center"
        >
          <Image
            src="./afhf-logo.png"
            alt="Advocates for Homeless Families Logo"
            width={188}
            height={186}
            className="flex-shrink-0 rounded-full max-2xl:w-40 max-2xl:h-40 max-md:w-28 max-md:h-28"
            priority
          />
        </Link>
        <div className="flex flex-col gap-6 items-center">
          <CardTitle className="text-3xl text-center max-md:hidden">
            Advocates for Homeless Families
          </CardTitle>
          <CardTitle className="text-2xl text-center max-xl:text-2xl">
            Transitional Housing Application
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="w-full">
        <div className="overflow-x-auto w-full scrollbar-hide">
          <ol className="flex flex-nowrap items-start w-max min-w-full py-3 justify-center">
            {sections.map((sec, index) => {
              const isHighlighted = index <= activeIndex;
              const Icon = sec.icon;

              return (
                <li
                  key={sec.id}
                  className="flex flex-col items-center space-y-2 w-24 shrink-0"
                >
                  <Button
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-10 h-10 rounded-full cursor-pointer ${isHighlighted ? "bg-[var(--secondary-background)] text-white border-none hover:bg-[var(--secondary-background)]" : "bg-white text-black border-none hover:bg-orange-300"}`}
                    variant="outline"
                  >
                    <Icon />
                  </Button>
                  <b className="text-xs text-center text-white px-4">
                    {sec.title}
                  </b>
                </li>
              );
            })}
          </ol>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col items-center justify-center">
          <p className="text-white">
            Step {activeSection} of {sections.length}
          </p>
          <p className="text-white font-bold">
            {sections.find((sec) => sec.id === activeSection)?.title}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
