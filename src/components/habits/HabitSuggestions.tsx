"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Lightbulb } from "lucide-react";
import { Habit } from "@/lib/types";

interface HabitSuggestionsProps {
  onAdd: (habit: Partial<Habit>) => void;
  existingHabits?: string[];
}

const RECOMMENDED_HABITS = [
  { 
    name: "Morning Meditation", 
    description: "Start your day with 5 minutes of mindful breathing to improve focus.", 
    category: "Mindfulness" 
  },
  { 
    name: "Read 10 Pages", 
    description: "Consistent reading expands your knowledge and reduces stress.", 
    category: "Learning" 
  },
  { 
    name: "Hydrate", 
    description: "Drink a full glass of water immediately after waking up to kickstart your metabolism.", 
    category: "Health" 
  },
  { 
    name: "Post-Work Walk", 
    description: "A 15-minute walk to clear your mind and transition out of work mode.", 
    category: "Health" 
  },
  { 
    name: "Inbox Zero", 
    description: "Process your primary inbox to zero every afternoon for mental clarity.", 
    category: "Productivity" 
  },
  { 
    name: "Daily Reflection", 
    description: "Write down three things you're grateful for before going to sleep.", 
    category: "Personal" 
  },
];

export function HabitSuggestions({ onAdd, existingHabits = [] }: HabitSuggestionsProps) {
  // Filter out habits the user is already tracking
  const filteredSuggestions = RECOMMENDED_HABITS.filter(
    s => !existingHabits.some(h => h.toLowerCase() === s.name.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="text-accent" size={20} />
        <h3 className="font-bold text-lg">Recommended for You</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((s, idx) => (
            <Card key={idx} className="bg-white border-muted hover:border-accent transition-all hover:shadow-lg flex flex-col h-full group">
              <CardContent className="p-5 flex flex-col h-full pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-primary/60 uppercase tracking-tighter">{s.category}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                </div>
                <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{s.name}</h4>
                <p className="text-sm text-muted-foreground mb-6 flex-grow leading-relaxed">{s.description}</p>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full gap-2 text-primary hover:bg-primary hover:text-white transition-colors font-bold"
                  onClick={() => onAdd({
                    name: s.name,
                    description: s.description,
                    category: s.category as any,
                  })}
                >
                  <PlusCircle size={14} />
                  Add Habit
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground italic">
            You're already tracking all our top recommendations! Keep up the great work.
          </div>
        )}
      </div>
    </div>
  );
}
