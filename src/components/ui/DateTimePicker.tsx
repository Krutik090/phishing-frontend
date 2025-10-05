import { useState, useRef, useEffect } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  minDateTime?: string;
}

export function DateTimePicker({
  value = "",
  onChange,
  label,
  required,
  error,
  placeholder = "Select date and time",
  
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"calendar" | "time">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      let hours = date.getHours();
      setSelectedPeriod(hours >= 12 ? "PM" : "AM");
      setSelectedHour(hours % 12 || 12);
      setSelectedMinute(date.getMinutes());
      setCurrentMonth(date);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    setView("time");
  };

  const handleTimeConfirm = () => {
    if (selectedDate) {
      const hours = selectedPeriod === "PM" ? (selectedHour % 12) + 12 : selectedHour % 12;
      const finalDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        hours,
        selectedMinute
      );
      onChange(finalDate.toISOString().slice(0, 16));
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChange("");
  };

  const formatDisplay = () => {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="relative" ref={pickerRef}>
      {label && (
        <label className="block font-medium mb-1 text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-input dark:bg-card border border-border rounded-md px-3 py-2 text-foreground dark:text-card-foreground cursor-pointer flex items-center justify-between hover:border-primary transition-colors"
      >
        <div className="flex items-center gap-2 flex-1">
          <Calendar className="w-4 h-4 text-foreground/60" />
          <span className={value ? "text-foreground" : "text-foreground/40"}>
            {formatDisplay() || placeholder}
          </span>
        </div>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="text-foreground/60 hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-2xl z-50 w-full min-w-[320px] max-w-[360px] overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-border bg-card">
            <button
              type="button"
              onClick={() => setView("calendar")}
              className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                view === "calendar"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <Calendar className="w-4 h-4" /> Date
            </button>
            <button
              type="button"
              onClick={() => setView("time")}
              disabled={!selectedDate}
              className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                view === "time"
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-foreground/60 hover:text-foreground hover:bg-accent/50 disabled:opacity-40 disabled:cursor-not-allowed"
              }`}
            >
              <Clock className="w-4 h-4" /> Time
            </button>
          </div>

          {/* Calendar View */}
          {view === "calendar" && (
            <div className="p-4 bg-card">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  className="p-1 hover:bg-accent rounded transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <span className="font-semibold text-foreground">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  className="p-1 hover:bg-accent rounded transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-foreground/60 py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth().map((day, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={!day}
                    onClick={() => day && handleDateSelect(day)}
                    className={`
                      aspect-square rounded-md text-sm transition-all
                      ${!day ? "invisible" : ""}
                      ${
                        isSelected(day!)
                          ? "bg-primary text-white font-bold scale-105"
                          : isToday(day!)
                          ? "bg-primary/20 text-primary font-semibold"
                          : "text-foreground hover:bg-accent hover:scale-105"
                      }
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Time View */}
          {view === "time" && (
            <div className="p-4 bg-card">
              {/* Time Display */}
              <div className="text-center mb-6 bg-background rounded-lg py-4">
                <div className="text-4xl font-bold text-foreground">
                  {selectedHour.toString().padStart(2, "0")}:
                  {selectedMinute.toString().padStart(2, "0")}
                  <span className="text-2xl ml-2 text-foreground/70">{selectedPeriod}</span>
                </div>
              </div>

              {/* Hour Selector */}
              <div className="mb-4">
                <label className="block text-xs font-medium mb-2 text-foreground/70 uppercase">Hour</label>
                <div className="grid grid-cols-6 gap-2">
                  {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => setSelectedHour(hour)}
                      className={`
                        py-2 rounded-md text-sm font-medium transition-all
                        ${
                          selectedHour === hour
                            ? "bg-primary text-white scale-105 shadow-md"
                            : "bg-background text-foreground hover:bg-accent hover:scale-105"
                        }
                      `}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minute Selector */}
              <div className="mb-4">
                <label className="block text-xs font-medium mb-2 text-foreground/70 uppercase">Minute</label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 15, 30, 45].map((min) => (
                    <button
                      key={min}
                      type="button"
                      onClick={() => setSelectedMinute(min)}
                      className={`
                        py-2 rounded-md text-sm font-medium transition-all
                        ${
                          selectedMinute === min
                            ? "bg-primary text-white scale-105 shadow-md"
                            : "bg-background text-foreground hover:bg-accent hover:scale-105"
                        }
                      `}
                    >
                      :{min.toString().padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>

              {/* AM/PM Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedPeriod("AM")}
                  className={`
                    flex-1 py-2 rounded-md font-semibold transition-all
                    ${
                      selectedPeriod === "AM"
                        ? "bg-primary text-white shadow-md"
                        : "bg-background text-foreground hover:bg-accent"
                    }
                  `}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPeriod("PM")}
                  className={`
                    flex-1 py-2 rounded-md font-semibold transition-all
                    ${
                      selectedPeriod === "PM"
                        ? "bg-primary text-white shadow-md"
                        : "bg-background text-foreground hover:bg-accent"
                    }
                  `}
                >
                  PM
                </button>
              </div>

              {/* Confirm Button */}
              <button
                type="button"
                onClick={handleTimeConfirm}
                disabled={!selectedDate}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
