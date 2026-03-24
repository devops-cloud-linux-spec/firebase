"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@/firebase";
import { signOut, updateProfile } from "firebase/auth";
import { Habit, HabitLog } from "@/lib/types";
import { HabitCard } from "@/components/habits/HabitCard";
import { MotivationCard } from "@/components/habits/MotivationCard";
import { HabitStats } from "@/components/habits/HabitStats";
import { CreateHabitDialog } from "@/components/habits/CreateHabitDialog";
import { HabitSuggestions } from "@/components/habits/HabitSuggestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Zap, LayoutDashboard, Calendar, LineChart, Target, Bell, LogOut, Loader2, PlusCircle, UserCog } from "lucide-react";
import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [userName, setUserName] = useState("");
  const [isUpdateNameOpen, setIsUpdateNameOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    } else if (user) {
      setUserName(user.displayName || user.email?.split('@')[0] || "");
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    const savedLogs = localStorage.getItem('habitLogs');
    
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    if (habits.length > 0 || logs.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
      localStorage.setItem('habitLogs', JSON.stringify(logs));
    }
  }, [habits, logs]);

  const addHabit = (newHabit: Omit<Habit, 'id' | 'createdAt'>) => {
    const habit: Habit = {
      ...newHabit,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setHabits([...habits, habit]);
    toast({ title: "Habit Created!", description: `Started tracking ${habit.name}.` });
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
    setLogs(logs.filter(l => l.habitId !== id));
    toast({ title: "Habit Removed", description: "Successfully deleted the habit." });
  };

  const toggleHabit = (habitId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const existingLogIndex = logs.findIndex(l => l.habitId === habitId && l.date === today);

    if (existingLogIndex > -1) {
      const newLogs = [...logs];
      newLogs.splice(existingLogIndex, 1);
      setLogs(newLogs);
    } else {
      setLogs([...logs, { habitId, date: today, completed: true }]);
      toast({ 
        title: "Daily Goal Met!", 
        description: "Consistency is the key to progress.",
      });
    }
  };

  const getStreak = (habitId: string) => {
    let streak = 0;
    let checkDate = new Date();
    
    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const log = logs.find(l => l.habitId === habitId && l.date === dateStr);
      if (log && log.completed) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const todayCompletedCount = habits.filter(h => 
    logs.some(l => l.habitId === h.id && l.date === format(new Date(), 'yyyy-MM-dd'))
  ).length;

  const totalPossibleToday = habits.length || 1;
  const progressPercent = Math.round((todayCompletedCount / totalPossibleToday) * 100);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      toast({ variant: "destructive", title: "Error signing out", description: "Please try again." });
    }
  };

  const handleUpdateName = async () => {
    if (!auth.currentUser || !userName.trim()) return;
    try {
      await updateProfile(auth.currentUser, { displayName: userName });
      toast({ title: "Profile Updated", description: "Your name has been updated successfully." });
      setIsUpdateNameOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not update your name." });
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-inner">
            <Zap size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-primary">Momentum</h1>
            <p className="text-muted-foreground font-medium">Keep your streak alive.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 pr-2 md:pr-6 rounded-full shadow-sm border border-muted group">
          <Avatar className="h-12 w-12 border-2 border-accent transition-transform group-hover:scale-105">
            <AvatarImage src={`https://picsum.photos/seed/${user.email}/100/100`} />
            <AvatarFallback>{user.email?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <Dialog open={isUpdateNameOpen} onOpenChange={setIsUpdateNameOpen}>
              <DialogTrigger asChild>
                <button className="text-left hover:bg-muted/50 px-2 py-1 rounded transition-colors group/name">
                  <p className="text-sm font-bold truncate max-w-[150px] flex items-center gap-1">
                    {user.displayName || user.email || "Explorer"}
                    <UserCog size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                  </p>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Display Name</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="display-name">Your Name</Label>
                    <Input 
                      id="display-name" 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)} 
                      placeholder="Enter your name"
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUpdateNameOpen(false)}>Cancel</Button>
                  <Button onClick={handleUpdateName}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-destructive" onClick={handleSignOut}>
            <LogOut size={18} />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Stats & Habits */}
        <main className="lg:col-span-8 space-y-8">
          
          <MotivationCard 
            streak={habits.length > 0 ? getStreak(habits[0].id) : 0} 
            habit={habits[0]} 
          />

          <Tabs defaultValue="habits" className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <TabsList className="bg-muted p-1 rounded-xl">
                <TabsTrigger value="habits" className="rounded-lg gap-2">
                  <LayoutDashboard size={16} /> Habits
                </TabsTrigger>
                <TabsTrigger value="discover" className="rounded-lg gap-2">
                  <Target size={16} /> Discover
                </TabsTrigger>
                <TabsTrigger value="stats" className="rounded-lg gap-2">
                  <LineChart size={16} /> Progress
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <CreateHabitDialog onSave={addHabit} />
              </div>
            </div>

            <TabsContent value="habits" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {habits.length === 0 ? (
                  <Card className="col-span-full border-dashed border-2 py-20 text-center bg-transparent">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-muted rounded-full">
                        <PlusCircle size={32} className="text-muted-foreground" />
                      </div>
                      <div className="max-w-xs mx-auto">
                        <h3 className="font-bold text-lg">No habits yet</h3>
                        <p className="text-sm text-muted-foreground">The journey of a thousand miles begins with a single step. Add your first habit above.</p>
                      </div>
                    </div>
                  </Card>
                ) : (
                  habits.map(habit => (
                    <HabitCard 
                      key={habit.id}
                      habit={habit}
                      streak={getStreak(habit.id)}
                      isCompletedToday={logs.some(l => l.habitId === habit.id && l.date === format(new Date(), 'yyyy-MM-dd'))}
                      onToggle={() => toggleHabit(habit.id)}
                      onDelete={() => deleteHabit(habit.id)}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="discover">
              <HabitSuggestions 
                existingHabits={habits.map(h => h.name)}
                onAdd={(h) => addHabit({
                  name: h.name!,
                  description: h.description!,
                  category: h.category!,
                  color: "#4D7A1F",
                  targetPerWeek: 7,
                  reminders: ["09:00"]
                })} 
              />
            </TabsContent>

            <TabsContent value="stats">
              <HabitStats habits={habits} logs={logs} />
            </TabsContent>
          </Tabs>
        </main>

        {/* Right Column - Side Panels */}
        <aside className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                Your Weekly Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <div className="text-4xl font-black text-primary">{progressPercent}%</div>
                  <div className="text-sm font-bold text-muted-foreground mb-1">Daily Target</div>
                </div>
                <Progress value={progressPercent} className="h-4 rounded-full" />
                
                <div className="grid grid-cols-7 gap-1 mt-4">
                  {eachDayOfInterval({
                    start: startOfWeek(new Date()),
                    end: endOfWeek(new Date())
                  }).map((day, idx) => {
                    const isToday = isSameDay(day, new Date());
                    const isDone = habits.length > 0 && habits.every(h => 
                      logs.some(l => l.habitId === h.id && l.date === format(day, 'yyyy-MM-dd'))
                    );
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{format(day, 'eee')[0]}</span>
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                          isToday ? "ring-2 ring-primary ring-offset-2" : "",
                          isDone ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                        )}>
                          {format(day, 'd')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell size={18} className="text-primary" />
                Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {habits.slice(0, 3).map(h => (
                  <div key={h.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-muted">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 rounded-full" style={{ backgroundColor: h.color }} />
                      <span className="font-bold text-sm">{h.name}</span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">08:00 AM</span>
                  </div>
                ))}
                {habits.length === 0 && (
                  <p className="text-sm text-muted-foreground italic text-center py-4">Set habit times to see reminders here.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
