"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Target } from "lucide-react";
import { Habit, HabitCategory } from "@/lib/types";

interface CreateHabitDialogProps {
  onSave: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
}

export function CreateHabitDialog({ onSave }: CreateHabitDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<HabitCategory>("Health");
  const [target, setTarget] = useState("7");
  const [color, setColor] = useState("#4D7A1F");

  const colors = [
    { name: "Forest", value: "#4D7A1F" },
    { name: "Ocean", value: "#0284c7" },
    { name: "Sunset", value: "#ea580c" },
    { name: "Lavender", value: "#9333ea" },
    { name: "Energy", value: "#A6F25A" },
  ];

  const handleSave = () => {
    if (!name) return;
    onSave({
      name,
      description,
      category,
      targetPerWeek: parseInt(target),
      color,
      reminders: ["08:00"],
    });
    setOpen(false);
    setName("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full shadow-lg gap-2">
          <Plus size={18} />
          Create New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Daily Habit</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input 
              id="name" 
              placeholder="e.g., Morning Workout" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              placeholder="What is your 'Why'?" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as HabitCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Learning">Learning</SelectItem>
                  <SelectItem value="Productivity">Productivity</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Target / Week</Label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num} days</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Color Identity</Label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${color === c.value ? "border-primary scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c.value }}
                  onClick={() => setColor(c.value)}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name}>Save Habit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}