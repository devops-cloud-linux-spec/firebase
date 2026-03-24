"use client";

import { Habit, HabitLog } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Flame, Target, Bell, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface HabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  streak: number;
  onToggle: () => void;
  onDelete: () => void;
}

export function HabitCard({ habit, isCompletedToday, streak, onToggle, onDelete }: HabitCardProps) {
  const progress = (streak / Math.max(habit.targetPerWeek * 4, 1)) * 100;

  return (
    <Card className="group transition-all hover:shadow-md border-muted">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: habit.color || 'var(--primary)' }} 
              />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {habit.category}
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
              {habit.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {habit.description}
            </p>
          </div>
          <Button
            size="icon"
            variant={isCompletedToday ? "default" : "outline"}
            className={cn(
              "h-12 w-12 rounded-full transition-all duration-300",
              isCompletedToday ? "bg-accent hover:bg-accent/90 text-accent-foreground" : "hover:border-accent hover:text-accent"
            )}
            onClick={onToggle}
          >
            {isCompletedToday ? <CheckCircle2 size={28} /> : <Circle size={28} />}
          </Button>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center text-sm font-medium">
            <div className="flex items-center gap-1.5 text-orange-600">
              <Flame size={16} className={streak > 0 ? "fill-orange-600" : ""} />
              <span>{streak} day streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Target size={16} />
              <span>{habit.targetPerWeek}x / week</span>
            </div>
          </div>
          <Progress value={Math.min(progress, 100)} className="h-1.5" />
        </div>

        <div className="mt-4 flex items-center justify-between pt-4 border-t border-muted opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            {habit.reminders.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                <Bell size={12} />
                <span>{habit.reminders[0]}</span>
              </div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={onDelete}
          >
            <Trash2 size={14} className="mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}