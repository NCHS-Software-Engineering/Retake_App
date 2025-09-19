"use client";
import HeroSection from "@/features/home/client/HeroSection";
import KeyFeatures from "@/features/home/client/KeyFeatures";
import HowWorks from "@/features/home/client/HowWorks";
import LearnMore from "@/features/home/client/LearnMore";
import { FadeInVariants } from "@/features/home/types/animation.types";

export default function Home() {

    const fadeIn: FadeInVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <main className="pt-16">
            <HeroSection fadeIn={fadeIn} />
            <KeyFeatures fadeIn={fadeIn} />
            <HowWorks fadeIn={fadeIn} />
            <LearnMore />
        </main>
    )
}