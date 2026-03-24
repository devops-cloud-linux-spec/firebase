"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, RefreshCw } from "lucide-react";
import { generateMotivation } from "@/ai/flows/generate-motivation";
import { Button } from "@/components/ui/button";
import { Habit } from "@/lib/types";

interface MotivationCardProps {
  habit?: Habit;
  streak?: number;
  totalCompletions?: number;
}

const FALLBACK_QUOTES = [
  "Every small step counts towards your larger goals. Keep moving forward!",
  "Consistency is the playground of excellence.",
  "Your future self will thank you for the work you do today.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "Don't decrease the goal. Increase the effort.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "The secret of your future is hidden in your daily routine.",
  "Disciplined action leads to ultimate freedom.",
  "Focus on progress, not perfection.",
  "A year from now, you'll wish you had started today.",
  "Energy and persistence conquer all things.",
  "Small daily improvements are the key to staggering long-term results."
];

export function MotivationCard({ habit, streak = 0, totalCompletions = 0 }: MotivationCardProps) {
  const [motivation, setMotivation] = useState<string>("Loading your daily spark...");
  const [loading, setLoading] = useState(false);

  const getRandomFallback = () => {
    return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  };

  const fetchMotivation = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    // Show a transition message while fetching
    setMotivation("Summoning a new spark of wisdom...");
    
    try {
      const result = await generateMotivation({
        habitName: habit?.name || "Your Journey",
        currentStreak: streak,
        totalCompletions: totalCompletions,
        motivationLevel: "medium",
      });
      
      if (result && result.message) {
        setMotivation(result.message);
      } else {
        throw new Error("Empty response");
      }
    } catch (error) {
      // If AI fails, pick a random high-quality fallback quote
      setMotivation(getRandomFallback());
    } finally {
      setLoading(false);
    }
  }, [habit?.name, streak, totalCompletions, loading]);

  useEffect(() => {
    fetchMotivation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habit?.id]); // Refresh when the active habit changes

  return (
    <Card className="bg-primary text-primary-foreground border-none shadow-lg overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110 duration-700 pointer-events-none">
        <Sparkles size={120} />
      </div>
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles size={18} className="animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider">AI Daily Wisdom</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary-foreground/50 hover:text-primary-foreground hover:bg-white/10 rounded-full transition-all active:scale-90"
            onClick={(e) => {
              e.preventDefault();
              fetchMotivation();
            }}
            disabled={loading}
            title="Generate new motivation"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : "transition-transform group-hover:rotate-180 duration-500"} />
          </Button>
        </div>
        <div className="min-h-[80px] flex items-center">
          <p className="text-xl md:text-2xl font-medium leading-relaxed italic transition-all duration-500">
            "{motivation}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
