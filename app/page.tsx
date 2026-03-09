"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  House,
  Car,
  Heart,
  Baby,
  Gavel,
  GraduationCap,
  Briefcase,
  ClipboardCheck,
} from "lucide-react";

import Header from "./components/header";
import Demographics from "./sections/demographics";
import Children from "./sections/children";
import CriminalHistory from "./sections/criminal_history";
import HousingHistory from "./sections/housing_history";
import Vehicles from "./sections/vehicles";
import Health from "./sections/health";
import Education from "./sections/education";
import { EmploymentForm } from "./sections/employment";
export default function Home() {
  const sections = [
    {
      title: "Demographics",
      id: 1,
      icon: User,
      component: <Demographics />,
    },
    {
      title: "Vehicles",
      id: 2,
      icon: Car,
      component: <Vehicles />,
    },
    {
      title: "Children",
      id: 3,
      icon: Baby,
      component: <Children />,
    },
    {
      title: "Criminal History",
      id: 4,
      icon: Gavel,
      component: <CriminalHistory />,
    },
    {
      title: "Housing History",
      id: 5,
      icon: House,
      component: <HousingHistory />,
    },
    {
      title: "Health",
      id: 6,
      icon: Heart,
      component: <Health />,
    },
    {
      title: "Education",
      id: 7,
      icon: GraduationCap,
      component: <Education />,
    },
    {
      title: "Employment",
      id: 8,
      icon: Briefcase,
      component: <EmploymentForm />,
    },
    {
      title: "Review",
      id: 9,
      icon: ClipboardCheck,
      component: <Demographics />,
    },
  ];

  const [activeSection, setActiveSection] = React.useState(sections[0].id);

  return (
    <main className="flex flex-col items-stretch min-h-screen w-full items-center justify-between bg-[var(--color-background)] dark:bg-black ">
      <Header
        sections={sections}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="flex w-full flex-row items-center justify-between">
        <Card className="w-full">
          <CardContent>
            <div className="flex justify-center p-5">
              {sections.find((sec) => sec.id === activeSection)?.component}
            </div>
            <div className="flex justify-end p-5 space-x-3">
              <Button className="w-25">Previous</Button>
              <Button className="w-25">Next</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
