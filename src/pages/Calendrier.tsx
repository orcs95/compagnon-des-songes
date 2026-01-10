import { Layout } from '@/components/layout/Layout';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type ViewMode = 'month' | 'week';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'jdr' | 'jds' | 'mtg';
  isFull: boolean;
}

const calendarEvents: CalendarEvent[] = [
  { id: '1', title: 'FNM Draft', date: new Date(2025, 0, 17), type: 'mtg', isFull: false },
  { id: '2', title: 'Soirée JdS', date: new Date(2025, 0, 18), type: 'jds', isFull: false },
  { id: '3', title: 'D&D Session 5', date: new Date(2025, 0, 24), type: 'jdr', isFull: true },
  { id: '4', title: 'FNM Standard', date: new Date(2025, 0, 24), type: 'mtg', isFull: false },
  { id: '5', title: 'Cthulhu Initiation', date: new Date(2025, 0, 25), type: 'jdr', isFull: false },
  { id: '6', title: 'FNM Commander', date: new Date(2025, 0, 31), type: 'mtg', isFull: false },
  { id: '7', title: 'Soirée Terraforming', date: new Date(2025, 1, 1), type: 'jds', isFull: false },
];

const typeColors: Record<string, string> = {
  jdr: 'bg-crimson border-crimson',
  jds: 'bg-forest border-forest',
  mtg: 'bg-primary border-primary',
};

const typeLabels: Record<string, string> = {
  jdr: 'JDR',
  jds: 'JdS',
  mtg: 'MTG',
};

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export default function Calendrier() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  const goToPrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    }
  };

  const goToNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="text-gold-gradient">Calendrier</span>
          </h1>
          <p className="text-center text-muted-foreground font-body max-w-2xl mx-auto">
            Consultez notre calendrier pour ne manquer aucun événement !
          </p>
        </div>
      </section>

      {/* Calendar Controls */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={goToPrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={goToToday} className="font-display">
                Aujourd'hui
              </Button>
              <Button variant="outline" size="icon" onClick={goToNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Current Month/Week */}
            <h2 className="font-display text-xl font-semibold">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('month')}
                className="font-display"
              >
                Mois
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('week')}
                className="font-display"
              >
                Semaine
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground font-body">Magic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-crimson" />
              <span className="text-sm text-muted-foreground font-body">JDR</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-forest" />
              <span className="text-sm text-muted-foreground font-body">Jeux de Société</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted border-2 border-destructive" />
              <span className="text-sm text-muted-foreground font-body">Complet</span>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {viewMode === 'month' ? (
            <MonthView currentDate={currentDate} events={calendarEvents} />
          ) : (
            <WeekView currentDate={currentDate} events={calendarEvents} />
          )}
        </div>
      </section>
    </Layout>
  );
}

function MonthView({ currentDate, events }: { currentDate: Date; events: CalendarEvent[] }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  let startDay = firstDayOfMonth.getDay() - 1;
  if (startDay < 0) startDay = 6;
  
  const daysInMonth = lastDayOfMonth.getDate();
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - startDay + 1;
    const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
    const date = new Date(year, month, dayNumber);
    const dayEvents = events.filter(e => 
      e.date.getDate() === dayNumber && 
      e.date.getMonth() === month && 
      e.date.getFullYear() === year
    );
    
    cells.push({
      dayNumber: isCurrentMonth ? dayNumber : null,
      isCurrentMonth,
      date,
      events: dayEvents,
    });
  }

  const today = new Date();

  return (
    <div className="card-fantasy rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 bg-muted/50">
        {DAYS.map(day => (
          <div key={day} className="p-3 text-center font-display text-sm font-semibold text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {cells.map((cell, index) => {
          const isToday = cell.isCurrentMonth && 
            cell.dayNumber === today.getDate() && 
            month === today.getMonth() && 
            year === today.getFullYear();

          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border-t border-l border-border ${
                !cell.isCurrentMonth ? 'bg-muted/30' : ''
              } ${isToday ? 'bg-primary/10' : ''}`}
            >
              {cell.dayNumber && (
                <>
                  <span className={`text-sm font-display ${isToday ? 'text-primary font-bold' : 'text-foreground'}`}>
                    {cell.dayNumber}
                  </span>
                  <div className="mt-1 space-y-1">
                    {cell.events.map(event => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded truncate cursor-pointer transition-opacity hover:opacity-80 ${
                          typeColors[event.type]
                        } ${event.isFull ? 'opacity-50 line-through' : ''}`}
                        title={event.title}
                      >
                        <span className="text-white font-body">{event.title}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ currentDate, events }: { currentDate: Date; events: CalendarEvent[] }) {
  // Get start of week (Monday)
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dayEvents = events.filter(e =>
      e.date.getDate() === date.getDate() &&
      e.date.getMonth() === date.getMonth() &&
      e.date.getFullYear() === date.getFullYear()
    );
    weekDays.push({ date, events: dayEvents });
  }

  const today = new Date();

  return (
    <div className="card-fantasy rounded-lg overflow-hidden">
      <div className="grid grid-cols-7">
        {weekDays.map((day, index) => {
          const isToday = 
            day.date.getDate() === today.getDate() &&
            day.date.getMonth() === today.getMonth() &&
            day.date.getFullYear() === today.getFullYear();

          return (
            <div
              key={index}
              className={`min-h-[300px] p-4 border-l border-border first:border-l-0 ${
                isToday ? 'bg-primary/10' : ''
              }`}
            >
              <div className="text-center mb-4">
                <p className="text-sm font-display text-muted-foreground">
                  {DAYS[index]}
                </p>
                <p className={`text-2xl font-display font-bold ${isToday ? 'text-primary' : ''}`}>
                  {day.date.getDate()}
                </p>
              </div>
              <div className="space-y-2">
                {day.events.map(event => (
                  <div
                    key={event.id}
                    className={`p-2 rounded text-sm cursor-pointer transition-all hover:scale-[1.02] ${
                      typeColors[event.type]
                    } ${event.isFull ? 'opacity-50' : ''}`}
                  >
                    <p className="font-body text-white font-medium truncate">{event.title}</p>
                    {event.isFull && (
                      <Badge variant="outline" className="mt-1 text-xs border-white/50 text-white">
                        Complet
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
